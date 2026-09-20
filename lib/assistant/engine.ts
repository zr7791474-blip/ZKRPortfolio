/**
 * ZKR portfolio assistant — answer engine.
 *
 * Deliberately NOT backed by a live LLM call: no external AI API, database or backend.
 * A local, deterministic intent matcher over the real facts in data/profile.ts guarantees
 * every answer is traceable to real portfolio content, and anything it can't match with
 * enough confidence gets an honest "I don't have that information" in the visitor's
 * language instead of a guess.
 *
 * How a question is understood (English / French / Spanish, plus a small Darija layer):
 *
 *  1. NORMALISE — lower-case, strip accents (é→e, ñ→n, ç→c), split into whole-word tokens,
 *     then lightly stem each token (skills→skill, studying→study, competences→competenc)
 *     so inflections match. Matching is always whole-token: "nta" can never fire inside
 *     "contact", "hi" never inside "this". (JS `\b` treats "é"/"ó" as non-word chars, so a
 *     regex boundary can't match words like "cómo" — folding tokens avoids that entirely.)
 *  2. SCORE INTENTS — every intent (skills, contact, experience, education, projects …)
 *     has keyword lists per language plus "combo" groups (e.g. a question word + a
 *     build-verb → projects, so "What have you created?" needs no exact phrase). A phrase
 *     scores by its length, a single keyword 2, a weak hint 1, a combo 3. Ties resolve by a
 *     fixed priority. Below MIN_CONFIDENT_SCORE the answer is the honest fallback.
 *  3. PICK THE LANGUAGE by score too (function words, language-specific vocabulary,
 *     script hints like ¿ ñ ç). Words shared by two languages cancel out; on a tie the
 *     website's current language wins.
 *  4. ANSWER with concise "Label: value" lines built only from data/profile.ts, plus
 *     localized follow-up suggestions.
 */

import { profile } from "@/data/profile";

export type AssistantLocale = "en" | "fr" | "es" | "darija";

type Lang = AssistantLocale;

export type Topic =
  | "greeting"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "contact"
  | "github"
  | "instagram"
  | "currentlyWorkingOn"
  | "thanks";

export type FollowUpTopic = "skills" | "projects" | "experience" | "contact" | "about";
export type FollowUp = { topic: FollowUpTopic; label: string };

// ---------------------------------------------------------------------------
// Normalisation: fold → tokenise → stem
// ---------------------------------------------------------------------------

/** Lower-case, strip diacritics (é→e, ñ→n, ç→c), expand ligatures. */
function fold(input: string): string {
  return input
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Latin letters/digits (Darija uses 3, 7, 9 …) and Arabic script. */
function tokenize(input: string): string[] {
  return fold(input).match(/[a-z0-9\u0600-\u06FF]+/g) ?? [];
}

/**
 * A deliberately small, consistent stemmer. It is applied to BOTH the keywords and the
 * visitor's words, so it only has to map inflections of the same word to the same string —
 * it does not need to be linguistically correct.
 */
function stem(word: string): string {
  if (!/^[a-z]+$/.test(word) || word.length < 4) return word;
  let s = word;
  if (s.length > 4 && (s.endsWith("ies") || s.endsWith("ied"))) s = `${s.slice(0, -3)}y`;
  else if (s.length > 5 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("es")) s = s.slice(0, -2);
  else if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  if (s.length > 4 && s.endsWith("e")) s = s.slice(0, -1);
  return s;
}

type Prepared = { count: number; set: Set<string>; padded: string };

function prepare(input: string): Prepared {
  const stems = tokenize(input).map(stem);
  return { count: stems.length, set: new Set(stems), padded: ` ${stems.join(" ")} ` };
}

function phraseKey(phrase: string): string {
  return tokenize(phrase).map(stem).join(" ");
}

// ---------------------------------------------------------------------------
// Intent vocabulary
//
// keywords : whole-word phrases. Written in natural form — accents and inflections are
//            handled by normalisation. A word valid in two languages is listed under both on
//            purpose so it never decides the language by itself.
// weak     : single hints worth 1 point — never enough alone to answer.
// combos   : each combo is a list of groups; every group needs ONE of its words present
//            (any order). This is how "what have you created" / "what did you build" /
//            "que fais-tu" style questions are recognised without exact phrases.
// ---------------------------------------------------------------------------

type Vocab = Partial<Record<Lang, string[]>>;
type Combos = Partial<Record<Lang, string[][][]>>;
type Intent = { keywords: Vocab; weak?: Vocab; combos?: Combos };

const INTENTS: Record<Topic, Intent> = {
  greeting: {
    keywords: {
      en: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
      fr: ["bonjour", "salut", "bonsoir", "coucou"],
      es: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches"],
      darija: ["salam", "slm", "labas", "ahlan", "marhba"],
    },
  },
  thanks: {
    keywords: {
      en: ["thank", "thanks", "thank you", "thx"],
      fr: ["merci", "merci beaucoup"],
      es: ["gracias", "muchas gracias"],
      darija: ["choukran", "shukran"],
    },
  },
  about: {
    keywords: {
      en: [
        "who are you", "who is zakaria", "about you", "about zakaria", "about yourself", "yourself",
        "introduce yourself", "what do you do", "what does zakaria do", "what is your job", "what s your job",
        "your job", "your profession", "your role",
      ],
      fr: [
        "qui es tu", "qui etes vous", "qui est zakaria", "parle moi de toi", "parlez moi de vous",
        "parle moi de zakaria", "presente toi", "presentez vous", "que fais tu", "que faites vous",
        "tu fais quoi", "qu est ce que tu fais", "quel est ton metier", "que fait zakaria", "ta profession",
      ],
      es: [
        "quien eres", "quien es zakaria", "hablame de ti", "hablame de zakaria", "cuentame sobre ti",
        "cuentame de ti", "presentate", "a que te dedicas", "a que se dedica", "que haces",
        "cual es tu trabajo", "que hace zakaria", "tu profesion",
      ],
      darija: ["chkoun", "chkon nta", "3lach ana"],
    },
  },
  experience: {
    keywords: {
      en: [
        "experience", "career", "work history", "background", "resume", "cv", "employer", "employment",
        "where have you worked", "where did you work", "where do you work", "where does zakaria work",
        "who have you worked for", "who do you work for", "have you worked", "worked for", "worked at",
        "your work", "work experience",
      ],
      fr: [
        "experience", "parcours", "carriere", "cv", "curriculum", "employeur", "emploi",
        "ou as tu travaille", "ou avez vous travaille", "ou travailles tu", "ou travaillez vous",
        "pour qui as tu travaille", "pour qui travailles tu", "ton travail", "votre travail", "experience professionnelle",
      ],
      es: [
        "experiencia", "trayectoria", "curriculum", "cv", "empleador", "empleo", "historial laboral",
        "donde has trabajado", "donde trabajaste", "donde trabajas", "para quien has trabajado", "para quien trabajas",
        "tu trabajo", "experiencia laboral", "experiencia profesional",
      ],
      darija: ["khdamt", "khdma", "3andk experience"],
    },
  },
  projects: {
    keywords: {
      en: ["project", "portfolio", "show me your work", "see your work", "work samples", "case study", "case studies", "showcase"],
      fr: ["projet", "portfolio", "realisation", "etude de cas", "etudes de cas", "tes travaux", "montre moi ton travail", "montrez moi votre travail"],
      es: ["proyecto", "portafolio", "portfolio", "tus trabajos", "muestrame tu trabajo", "caso de estudio", "casos de estudio"],
      darija: ["chnou dertihom", "chno dert", "dert chi projet"],
    },
    combos: {
      // (question word) × (build verb): "what have you created", "what did you build"
      en: [[["what", "which", "anything", "something", "things"], ["built", "build", "created", "create", "made", "make", "developed", "develop", "shipped", "ship", "designed", "coded"]]],
      fr: [[["que", "qu", "quoi", "quels", "quelles", "quel", "quelle"], ["cree", "crees", "creer", "construit", "construits", "construire", "realise", "realises", "realiser", "developpe", "developpes", "developper"]]],
      es: [[["que", "cuales", "cual", "cosas"], ["creado", "creaste", "creas", "construido", "construiste", "hecho", "hiciste", "desarrollado", "desarrollaste", "desarrollas"]]],
    },
  },
  skills: {
    keywords: {
      en: [
        "skill", "technology", "tech stack", "stack", "tools", "framework", "programming languages",
        "programming language", "coding languages", "what do you code in", "what do you code with",
      ],
      fr: [
        "competence", "technologie", "stack technique", "stack", "outils", "outil", "framework",
        "langages de programmation", "langage de programmation", "connaissances techniques",
      ],
      es: [
        "habilidad", "tecnologia", "stack", "herramientas", "herramienta", "framework",
        "lenguajes de programacion", "lenguaje de programacion", "conocimientos",
      ],
      darija: ["ash ta3ref", "wach ta3ref", "3arf ash"],
    },
    weak: {
      en: ["technical", "tech", "coding", "expertise", "proficient", "proficiency"],
      fr: ["technique", "techniques", "maitrise", "maitrises"],
      es: ["tecnico", "tecnica", "dominas", "manejas"],
    },
    combos: {
      // (verb of using/knowing) × (technology noun)
      en: [[["use", "used", "using", "know", "work", "code", "program", "master", "familiar", "comfortable"], ["technology", "tech", "stack", "framework", "language", "tool", "library", "database"]]],
      fr: [[["utilise", "utilises", "utilisez", "maitrise", "maitrises", "maitrisez", "connais", "connait", "connaissez", "travaille", "travailles", "travaillez", "codes", "programmes"], ["technologie", "stack", "outils", "langages", "langage", "framework", "frameworks", "base"]]],
      es: [[["usas", "utilizas", "manejas", "dominas", "conoces", "sabes", "trabajas", "programas", "codificas", "utiliza"], ["tecnologia", "stack", "herramientas", "lenguajes", "lenguaje", "framework", "frameworks", "base"]]],
    },
  },
  education: {
    keywords: {
      en: ["education", "degree", "university", "school", "studies", "study", "studied", "studying", "diploma", "college", "graduate", "graduated", "student"],
      fr: ["education", "etudes", "etude", "etudie", "etudies", "etudiez", "etudier", "etudiant", "diplome", "ecole", "universite", "formation"],
      es: ["educacion", "estudios", "estudio", "estudias", "estudiaste", "estudiado", "estudiar", "estudiando", "estudiante", "formacion", "formacion academica", "titulo", "universidad", "escuela"],
      darija: ["qraya", "fin qriti", "qrit"],
    },
  },
  contact: {
    keywords: {
      en: [
        "contact", "reach you", "reach zakaria", "reach out", "get in touch", "in touch", "hire you", "hire zakaria", "hire",
        "email", "e mail", "mail", "email address", "find you", "find zakaria", "talk to you", "speak to you",
        "message you", "write to you", "work with you", "work together", "collaborate",
      ],
      fr: [
        "contact", "contacter", "joindre", "prendre contact", "email", "e mail", "mail", "courriel", "adresse mail",
        "te trouver", "vous trouver", "ecrire", "embaucher", "engager", "recruter", "travailler avec toi",
        "travailler avec vous", "collaborer",
      ],
      es: [
        "contacto", "contactar", "contactarte", "contactarlo", "ponerme en contacto", "correo", "correo electronico",
        "email", "e mail", "escribirte", "escribirle", "hablar contigo", "comunicarme contigo", "comunicarte", "comunicarse contigo", "encontrarte", "encontrarlo",
        "contratar", "contratarte", "trabajar contigo", "trabajar con usted", "colaborar",
      ],
      darija: ["kifach n7wsslk", "3ayan nkhdm m3ak", "bghit nkhdm m3ak"],
    },
  },
  github: {
    keywords: {
      en: ["github", "git hub", "source code", "repo", "repository"],
      fr: ["github", "depot", "code source"],
      es: ["github", "repositorio", "codigo fuente"],
    },
  },
  instagram: {
    keywords: {
      en: ["instagram", "insta"],
      fr: ["instagram", "insta"],
      es: ["instagram", "insta"],
    },
  },
  currentlyWorkingOn: {
    keywords: {
      en: ["currently working", "working on now", "right now", "available", "availability", "open to work", "open to projects", "freelance"],
      fr: ["actuellement", "disponible", "disponibilite", "en ce moment", "freelance"],
      es: ["actualmente", "disponible", "disponibilidad", "en este momento", "ahora mismo", "freelance"],
      darija: ["daba fach khdam", "wach mtach", "wach available"],
    },
  },
};

/** Content intents in tie-break order (first wins on equal scores). */
const CONTENT_INTENTS: Topic[] = [
  "contact", "github", "instagram", "currentlyWorkingOn", "education", "skills", "projects", "experience", "about",
];

/** Below this the question is treated as not understood (a lone weak hint is never enough). */
const MIN_CONFIDENT_SCORE = 2;

const LANGS: Lang[] = ["en", "fr", "es", "darija"];

type CompiledIntent = {
  phrases: Array<{ key: string; weight: number }>;
  weak: string[];
  combos: string[][][];
};

function compileIntent(intent: Intent): CompiledIntent {
  const seen = new Set<string>();
  const phrases: CompiledIntent["phrases"] = [];
  for (const lang of LANGS) {
    for (const phrase of intent.keywords[lang] ?? []) {
      const key = phraseKey(phrase);
      if (!key || seen.has(key)) continue; // the same folded phrase listed under two languages counts once
      seen.add(key);
      const tokens = key.split(" ").length;
      phrases.push({ key, weight: tokens === 1 ? 2 : tokens + 1 });
    }
  }
  const weak = LANGS.flatMap((l) => intent.weak?.[l] ?? []).map(phraseKey);
  const combos = LANGS.flatMap((l) => intent.combos?.[l] ?? []).map((groups) =>
    groups.map((alternatives) => alternatives.map(phraseKey))
  );
  return { phrases, weak, combos };
}

const COMPILED = Object.fromEntries(
  (Object.keys(INTENTS) as Topic[]).map((topic) => [topic, compileIntent(INTENTS[topic])])
) as Record<Topic, CompiledIntent>;

function scoreIntent(text: Prepared, topic: Topic): number {
  const intent = COMPILED[topic];
  let score = 0;
  for (const p of intent.phrases) if (text.padded.includes(` ${p.key} `)) score += p.weight;
  for (const w of intent.weak) if (text.set.has(w)) score += 1;
  for (const combo of intent.combos) if (combo.every((group) => group.some((w) => text.set.has(w)))) score += 3;
  return score;
}

type Detection = { topic: Topic | null; score: number };

function detectIntent(text: Prepared): Detection {
  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of CONTENT_INTENTS) {
    const score = scoreIntent(text, topic);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  if (best && bestScore >= MIN_CONFIDENT_SCORE) return { topic: best, score: bestScore };

  // Pleasantries only answer short messages ("hello", "thanks a lot") — "Hi, what's your
  // favourite colour?" is an unknown question, not a greeting.
  if (text.count <= 5) {
    if (scoreIntent(text, "thanks") >= MIN_CONFIDENT_SCORE) return { topic: "thanks", score: 2 };
    if (scoreIntent(text, "greeting") >= MIN_CONFIDENT_SCORE) return { topic: "greeting", score: 2 };
  }
  return { topic: null, score: bestScore };
}

// ---------------------------------------------------------------------------
// Language detection
// ---------------------------------------------------------------------------

const LANG_MARKERS: Record<Lang, string[]> = {
  en: [
    "what", "whats", "are", "is", "your", "you", "how", "can", "could", "would", "tell", "about", "who", "where",
    "when", "which", "does", "did", "have", "the", "and", "with", "this", "that", "please", "reach", "get",
    "know", "more", "show", "any", "do", "yourself", "like", "much", "many", "old", "favorite", "favourite", "live",
    "based", "from", "why", "want", "need", "charge", "hour", "of", "spain", "france", "coffee",
  ],
  fr: [
    "quelle", "quelles", "quel", "quels", "comment", "puis", "je", "tes", "ton", "ta", "vous", "votre", "vos", "moi",
    "parle", "parlez", "dis", "dites", "peux", "peut", "pouvez", "pourquoi", "avec", "quoi", "une", "des", "les",
    "du", "est", "sont", "suis", "mes", "ces", "cette", "qui", "sur", "dans", "montre", "montrez", "fais", "faites",
    "toi", "et", "ou", "aimes", "aime", "aimez", "combien", "quand", "pas", "ne", "il", "elle", "nous", "notre",
    "habites", "habitez", "travailles", "travaillez", "veux", "voudrais", "ans", "prefere", "capitale", "coute",
    "espagne", "france", "avez", "faire", "fait", "pourquoi", "merci", "qu", "utilises", "utilise", "utilisez", "connais", "connait", "connaissez", "maitrises", "cree", "realises", "realise", "construit", "trouver", "joindre", "etudie", "etudies",
  ],
  es: [
    "cual", "cuales", "como", "quien", "quienes", "donde", "cuando", "cuanto", "puedo", "puedes", "puede", "eres",
    "soy", "tus", "sus", "mis", "para", "con", "sobre", "el", "los", "las", "una", "del", "por", "favor", "pero",
    "muy", "tienes", "tiene", "quiero", "quisiera", "hablame", "cuentame", "dime", "muestrame", "dedicas", "haces",
    "ti", "gusta", "gustan", "anos", "cuantos", "cuanto", "cuantas", "favorita", "favorito", "comida", "vives",
    "hablas", "trabajas", "cobras", "precio", "cuesta", "quieres", "hago", "tengo", "usted", "ustedes", "nosotros",
    "ahora", "siempre", "nunca", "porque", "tambien", "mucho", "francia", "espana", "gracias", "utilizas", "usas", "conoces", "sabes", "manejas", "dominas", "creado", "creaste", "hecho", "hiciste", "estudiado", "encontrarte", "contigo",
  ],
  darija: [
    "wach", "kif", "kifach", "bghit", "chno", "chnou", "3lach", "mzyan", "mezyan", "dyal", "3andk", "3andek", "nta",
    "nti", "hna", "daba", "fin", "khouya", "sahbi",
  ],
};

/** Script-level hints. é / ü are shared by FR and ES so they are not used. */
const CHAR_HINTS: Partial<Record<Lang, RegExp>> = {
  es: /[¿¡ñáíóú]/g,
  fr: /[àèêâîïôùûçœë]/g,
};

const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

function scoreLanguages(input: string): Record<Lang, number> {
  const text = prepare(input);
  const tokenSet = new Set(tokenize(input));
  const raw = input.toLowerCase();
  const score: Record<Lang, number> = { en: 0, fr: 0, es: 0, darija: 0 };

  for (const lang of LANGS) {
    for (const marker of LANG_MARKERS[lang]) {
      if (tokenSet.has(marker)) score[lang] += 1;
    }
    const chars = CHAR_HINTS[lang];
    if (chars) {
      const found = new Set(raw.match(chars) ?? []);
      score[lang] += Math.min(found.size, 2);
    }
  }

  // Topic vocabulary is language-specific evidence too (keywords only).
  for (const intent of Object.values(INTENTS)) {
    for (const lang of LANGS) {
      for (const phrase of intent.keywords[lang] ?? []) {
        if (text.padded.includes(` ${phraseKey(phrase)} `)) score[lang] += 1;
      }
    }
  }

  if (ARABIC_SCRIPT.test(input)) score.darija += 3;
  return score;
}

/**
 * Pick the language of `input`. Ties (including "no evidence at all") are resolved in
 * favour of `fallback` — the language the website is currently displayed in — when it is
 * among the leaders, otherwise en → fr → es.
 */
export function detectLanguage(input: string, fallback: AssistantLocale = "en"): AssistantLocale {
  const score = scoreLanguages(input);
  const max = Math.max(...LANGS.map((l) => score[l]));
  if (max === 0) return fallback;
  const leaders = LANGS.filter((l) => score[l] === max);
  if (leaders.includes(fallback)) return fallback;
  return leaders[0] ?? fallback;
}

// ---------------------------------------------------------------------------
// Answers — concise "Label: value" lines built ONLY from data/profile.ts
// ---------------------------------------------------------------------------

const lines = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join("\n");
const list = (items: readonly string[], count: number): string => items.slice(0, count).join(", ");

function buildResponses(): Record<Topic, Record<AssistantLocale, string>> {
  const { name, alias, location, skills, contact, projects: projectList } = profile;
  const first = name.split(" ")[0];
  const count = projectList.length;
  const sample = projectList.slice(0, 3).map((p) => p.title).join(", ");
  const fe = list(skills.frontend, 4);
  const be = list(skills.backend, 3);
  const db = list(skills.database, 2);
  const tools = list(skills.tools, 3);

  const channel = (label: string, value: string | undefined, sep = ":") => (value ? `${label}${sep} ${value}` : null);
  const noChannels = {
    en: "Use the contact section on this site to get in touch.",
    fr: "Utilisez la section contact de ce site pour le joindre.",
    es: "Usa la sección de contacto de este sitio para escribirle.",
    darija: 'Khdem b section "Contact" bach tcontacti.',
  };
  const hasChannels = Boolean(contact.email || contact.github || contact.instagram);

  return {
    greeting: {
      en: `Hi! I'm ${alias}'s assistant. Ask about ${first}'s experience, projects, skills, or how to get in touch.`,
      fr: `Bonjour ! Je suis l'assistant de ${alias}. Posez-moi des questions sur l'expérience, les projets, les compétences de ${first}, ou comment le contacter.`,
      es: `¡Hola! Soy el asistente de ${alias}. Pregúntame sobre la experiencia, los proyectos o las habilidades de ${first}, o cómo contactarlo.`,
      darija: `Salam! Ana l'assistant dyal ${alias}. Sowlni 3la l'expérience, les projets, wla les compétences dyal ${first}, wla kifach tqder tcontacti.`,
    },
    about: {
      en: lines(`${name} (${alias}) is a full-stack developer based in ${location}.`, "His work covers frontend interfaces, backend logic and database design."),
      fr: lines(`${name} (${alias}) est développeur full-stack basé à ${location}.`, "Son travail couvre les interfaces frontend, la logique backend et la conception de bases de données."),
      es: lines(`${name} (${alias}) es desarrollador full-stack con base en ${location}.`, "Su trabajo abarca interfaces frontend, lógica backend y diseño de bases de datos."),
      darija: `${name}, li khddam b ism ${alias}, howa full-stack developer f ${location}. Khddam 3la kolchi: frontend, backend, o database.`,
    },
    experience: {
      en: lines(
        `Role: Independent full-stack developer (${alias})`,
        `Based in: ${location}`,
        "Scope: from database design to the interface, end to end",
        `Shipped: ${count} production-ready products, including ${sample}`
      ),
      fr: lines(
        `Rôle : développeur full-stack indépendant (${alias})`,
        `Basé à : ${location}`,
        "Périmètre : de la base de données à l'interface, de bout en bout",
        `Livré : ${count} produits prêts pour la production, dont ${sample}`
      ),
      es: lines(
        `Rol: desarrollador full-stack independiente (${alias})`,
        `Ubicación: ${location}`,
        "Alcance: de la base de datos a la interfaz, de principio a fin",
        `Entregado: ${count} productos listos para producción, incluyendo ${sample}`
      ),
      darija: `${name} khddam b rasso f full-stack development (${alias}), f ${location}. Kaydir kolchi mn database l'interface, o dar ${count} d les projets kaymchiw l production.`,
    },
    projects: {
      en: lines(`Built: ${count} complete products`, `Including: ${sample}`, "Each one has a full case study in the Work section."),
      fr: lines(`Réalisé : ${count} produits complets`, `Dont : ${sample}`, "Chacun a une étude de cas complète dans la section Travaux."),
      es: lines(`Creado: ${count} productos completos`, `Incluye: ${sample}`, "Cada uno tiene un caso de estudio completo en la sección de Trabajos."),
      darija: `${name} dar ${count} projets kamlin, fihom ${sample}. Tql9ahom fi section "Work" f had page.`,
    },
    skills: {
      en: lines(`Frontend: ${fe}`, `Backend: ${be}`, `Data: ${db}`, `Tools: ${tools}`),
      fr: lines(`Frontend : ${fe}`, `Backend : ${be}`, `Données : ${db}`, `Outils : ${tools}`),
      es: lines(`Frontend: ${fe}`, `Backend: ${be}`, `Datos: ${db}`, `Herramientas: ${tools}`),
      darija: lines(`Frontend: ${fe}`, `Backend: ${be}`, `Data: ${db}`, `Tools: ${tools}`),
    },
    // No formal education is listed anywhere on this portfolio — stay honest rather than invent one.
    education: {
      en: `Education isn't listed on this portfolio — you can ask ${first} directly.`,
      fr: `La formation n'est pas indiquée sur ce portfolio — vous pouvez poser la question directement à ${first}.`,
      es: `La formación no aparece en este portafolio — puedes preguntárselo directamente a ${first}.`,
      darija: `L'éducation mamawjouda f had portfolio. Tqder tsowl ${first} b nafso.`,
    },
    contact: {
      en: hasChannels
        ? lines(`You can reach ${first} here:`, channel("Email", contact.email), channel("GitHub", contact.github), channel("Instagram", contact.instagram))
        : noChannels.en,
      fr: hasChannels
        ? lines(`Vous pouvez joindre ${first} ici :`, channel("E-mail", contact.email, " :"), channel("GitHub", contact.github, " :"), channel("Instagram", contact.instagram, " :"))
        : noChannels.fr,
      es: hasChannels
        ? lines(`Puedes contactar a ${first} aquí:`, channel("Correo", contact.email), channel("GitHub", contact.github), channel("Instagram", contact.instagram))
        : noChannels.es,
      darija: hasChannels
        ? lines(`Tqder tcontacti ${first} hna:`, channel("Email", contact.email), channel("GitHub", contact.github), channel("Instagram", contact.instagram))
        : noChannels.darija,
    },
    github: {
      en: contact.github ? `GitHub: ${contact.github}` : `No public GitHub is listed — contact ${first} directly for that.`,
      fr: contact.github ? `GitHub : ${contact.github}` : `Aucun GitHub public n'est indiqué — contactez ${first} directement.`,
      es: contact.github ? `GitHub: ${contact.github}` : `No hay un GitHub público indicado — contacta a ${first} directamente.`,
      darija: contact.github ? `GitHub: ${contact.github}` : `Makaynch GitHub 3lani. Contacti ${first} b nafso.`,
    },
    instagram: {
      en: contact.instagram ? `Instagram: ${contact.instagram}` : `No Instagram is listed — contact ${first} directly instead.`,
      fr: contact.instagram ? `Instagram : ${contact.instagram}` : `Aucun Instagram n'est indiqué — contactez ${first} directement.`,
      es: contact.instagram ? `Instagram: ${contact.instagram}` : `No hay un Instagram indicado — contacta a ${first} directamente.`,
      darija: contact.instagram ? `Instagram: ${contact.instagram}` : `Makaynch Instagram 3lani. Contacti ${first} b nafso.`,
    },
    currentlyWorkingOn: {
      en: lines("Available for selected full-stack projects.", "Use the contact section to start a conversation."),
      fr: lines("Disponible pour des projets full-stack sélectionnés.", "Rendez-vous dans la section contact pour démarrer une conversation."),
      es: lines("Disponible para proyectos full-stack seleccionados.", "Visita la sección de contacto para iniciar una conversación."),
      darija: `Daba ${alias} disponible bach ydir des nouveaux projets — sift message f section "Contact".`,
    },
    thanks: {
      en: `You're welcome! Anything else about ${first}'s work?`,
      fr: `Avec plaisir ! Autre chose sur le travail de ${first} ?`,
      es: `¡De nada! ¿Algo más sobre el trabajo de ${first}?`,
      darija: `Bla jmil! Kayn chi haja khra bghiti ta3rfha 3la ${first}?`,
    },
  };
}

const RESPONSES = buildResponses();

/** Honest "not understood" reply — says so, then lists what the assistant actually can answer. */
const FALLBACK: Record<AssistantLocale, string> = {
  en: `I don't have that information. I can help with ${profile.name.split(" ")[0]}'s projects, skills, experience or contact details.`,
  fr: `Je n'ai pas cette information. Je peux vous parler des projets, des compétences, de l'expérience ou des coordonnées de ${profile.name.split(" ")[0]}.`,
  es: `No tengo esa información. Puedo ayudarte con los proyectos, las habilidades, la experiencia o los datos de contacto de ${profile.name.split(" ")[0]}.`,
  darija: `Ma3ndich had l'ma3loma. Nqder n3awnek f les projets, les compétences, l'expérience wla contact dyal ${profile.name.split(" ")[0]}.`,
};

const ERROR_MESSAGE: Record<AssistantLocale, string> = {
  en: `Something went wrong on my end. Please use the contact section to reach ${profile.name.split(" ")[0]} directly.`,
  fr: `Une erreur s'est produite de mon côté. Merci d'utiliser la section contact pour joindre ${profile.name.split(" ")[0]} directement.`,
  es: `Algo salió mal de mi lado. Usa la sección de contacto para escribir a ${profile.name.split(" ")[0]} directamente.`,
  darija: `Kayn chi mochkil. Khdem b section "Contact" bach tcontacti ${profile.name.split(" ")[0]}.`,
};

// ---------------------------------------------------------------------------
// Follow-up suggestions (labelled in the language of the reply)
// ---------------------------------------------------------------------------

const FOLLOW_UP_LABELS: Record<AssistantLocale, Record<FollowUpTopic, string>> = {
  en: { skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact", about: "About" },
  fr: { skills: "Compétences", projects: "Projets", experience: "Expérience", contact: "Contact", about: "À propos" },
  es: { skills: "Habilidades", projects: "Proyectos", experience: "Experiencia", contact: "Contacto", about: "Acerca de" },
  darija: { skills: "Skills", projects: "Projets", experience: "Expérience", contact: "Contact", about: "3la Zakaria" },
};

const FOLLOW_UPS: Record<Topic | "fallback", FollowUpTopic[]> = {
  skills: ["projects", "experience", "contact"],
  projects: ["skills", "experience", "contact"],
  experience: ["projects", "skills", "contact"],
  about: ["skills", "projects", "contact"],
  education: ["experience", "skills", "contact"],
  contact: ["projects", "skills"],
  github: ["projects", "contact"],
  instagram: ["projects", "contact"],
  currentlyWorkingOn: ["projects", "contact"],
  greeting: [],
  thanks: [],
  fallback: ["skills", "projects", "experience", "contact"],
};

export type AssistantAnswer = {
  text: string;
  topic: Topic | "fallback";
  locale: AssistantLocale;
  /** Suggested next questions, labelled in `locale`. */
  followUps: FollowUp[];
};

function followUpsFor(topic: Topic | "fallback", locale: AssistantLocale): FollowUp[] {
  return FOLLOW_UPS[topic].map((t) => ({ topic: t, label: FOLLOW_UP_LABELS[locale][t] }));
}

/** Answer a known topic directly (used by the follow-up chips — no re-parsing of a label). */
export function answerTopic(topic: Topic | "fallback", locale: AssistantLocale = "en"): AssistantAnswer {
  const text = topic === "fallback" ? FALLBACK[locale] : RESPONSES[topic][locale];
  return { text, topic, locale, followUps: followUpsFor(topic, locale) };
}

/**
 * @param siteLocale the language the website UI is currently in. Used only when the
 * question itself gives no language signal (e.g. "github", "cv").
 */
export function answerQuestion(input: string, siteLocale: AssistantLocale = "en"): AssistantAnswer {
  const locale = detectLanguage(input, siteLocale);
  const { topic } = detectIntent(prepare(input));
  return answerTopic(topic ?? "fallback", locale);
}

export function welcomeMessage(locale: AssistantLocale = "en"): string {
  return RESPONSES.greeting[locale];
}

export function errorMessage(locale: AssistantLocale = "en"): string {
  return ERROR_MESSAGE[locale];
}
