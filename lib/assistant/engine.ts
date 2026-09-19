/**
 * ZKR portfolio assistant — answer engine.
 *
 * Deliberately NOT backed by a live LLM call: this project has no LLM API
 * key configured, and the brief is explicit that the assistant must never
 * invent information. A small deterministic intent-matcher over the real
 * facts in data/profile.ts guarantees every answer is traceable to real
 * portfolio content, and any unmatched question gets an honest
 * "I don't have that" fallback instead of a guess.
 *
 * Matching model (English / French / Spanish, plus a small Darija layer):
 *
 *  1. Input is folded (lower-cased, accents stripped, œ/æ expanded) and split
 *     into tokens. A keyword matches only as a WHOLE-WORD token sequence —
 *     never as a substring ("nta" can't fire inside "contact", "hi" can't
 *     fire inside "this"). Folding is what makes accented keywords work:
 *     JS `\b` treats "é"/"ó" as non-word characters, so a regex boundary
 *     can never match words like "cómo" or "qué".
 *  2. Language is chosen by SCORE (function words, language-specific topic
 *     vocabulary, and script hints such as ¿ ñ ç), not first-hit-wins. Words
 *     that exist in two languages (e.g. "experience") vote for both and so
 *     cancel out. If nothing decides it, the caller's site language wins.
 *  3. Topic is chosen by weighted keyword hits across all languages, with a
 *     fixed priority as tie-breaker. Greetings / thanks only answer when no
 *     content topic matched ("Hi, how can I contact you?" is a contact
 *     question, not just a greeting).
 */

import { profile } from "@/data/profile";

export type AssistantLocale = "en" | "fr" | "es" | "darija";

type Lang = AssistantLocale;

type Topic =
  | "greeting"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "contact"
  | "github"
  | "instagram"
  | "email"
  | "currentlyWorkingOn"
  | "thanks";

// ---------------------------------------------------------------------------
// Text folding & whole-word matching
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

/** Latin letters/digits (Darija uses digits like 3, 7, 9) and Arabic script. */
function tokenize(input: string): string[] {
  return fold(input).match(/[a-z0-9\u0600-\u06FF]+/g) ?? [];
}

/** " tok1 tok2 tok3 " — lets us test whole-word phrases with one includes(). */
function pad(tokens: string[]): string {
  return ` ${tokens.join(" ")} `;
}

function hasPhrase(paddedText: string, phrase: string): boolean {
  return paddedText.includes(pad(tokenize(phrase)));
}

// ---------------------------------------------------------------------------
// Topic vocabulary — per language. Phrases are whole-word, accent-insensitive.
// A word that is valid in two languages is listed under both on purpose: it
// then votes for both languages and never decides the language by itself.
// ---------------------------------------------------------------------------

type Vocab = Partial<Record<Lang, string[]>>;

const TOPIC_KEYWORDS: Record<Topic, Vocab> = {
  greeting: {
    en: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    fr: ["bonjour", "salut", "bonsoir", "coucou"],
    es: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches"],
    darija: ["salam", "slm", "labas", "ahlan", "marhba"],
  },
  thanks: {
    en: ["thank", "thanks", "thank you", "thx"],
    fr: ["merci", "merci beaucoup"],
    es: ["gracias", "muchas gracias"],
    darija: ["choukran", "shukran"],
  },
  about: {
    en: [
      "who are you",
      "who is zakaria",
      "about you",
      "about zakaria",
      "about yourself",
      "tell me about yourself",
      "introduce yourself",
      "what do you do",
      "what does zakaria do",
      "what is your job",
      "what s your job",
    ],
    fr: [
      "qui es tu",
      "qui etes vous",
      "qui est zakaria",
      "parle moi de toi",
      "parlez moi de vous",
      "parle moi de zakaria",
      "presente toi",
      "presentez vous",
      "que fais tu",
      "que faites vous",
      "tu fais quoi",
      "qu est ce que tu fais",
      "quel est ton metier",
      "que fait zakaria",
    ],
    es: [
      "quien eres",
      "quien es zakaria",
      "hablame de ti",
      "hablame de zakaria",
      "cuentame sobre ti",
      "cuentame de ti",
      "presentate",
      "a que te dedicas",
      "a que se dedica",
      "que haces",
      "cual es tu trabajo",
      "que hace zakaria",
    ],
    darija: ["chkoun", "chkon nta", "3lach ana"],
  },
  experience: {
    en: ["experience", "career", "work history", "background", "resume", "cv"],
    fr: ["experience", "parcours", "carriere", "cv", "curriculum"],
    es: ["experiencia", "trayectoria", "curriculum", "cv"],
    darija: ["khdamt", "khdma", "3andk experience"],
  },
  projects: {
    en: ["project", "projects", "portfolio", "your work", "case study", "case studies", "what have you built", "what did you build"],
    fr: ["projet", "projets", "portfolio", "realisation", "realisations", "etude de cas", "etudes de cas"],
    es: ["proyecto", "proyectos", "portafolio", "portfolio", "tus trabajos", "caso de estudio", "casos de estudio"],
    darija: ["chnou dertihom", "chno dert", "dert chi projet"],
  },
  skills: {
    en: ["skill", "skills", "technology", "technologies", "tech stack", "stack", "tools", "programming languages"],
    fr: ["competence", "competences", "technologie", "technologies", "stack", "outils", "langages"],
    es: ["habilidad", "habilidades", "tecnologia", "tecnologias", "stack", "herramientas", "conocimientos"],
    darija: ["ash ta3ref", "wach ta3ref", "3arf ash"],
  },
  education: {
    en: ["education", "degree", "university", "school", "studies", "studied", "diploma", "college"],
    fr: ["education", "etudes", "etudie", "diplome", "ecole", "universite", "formation"],
    es: ["educacion", "estudios", "estudiaste", "titulo", "universidad", "escuela"],
    darija: ["qraya", "fin qriti", "qrit"],
  },
  contact: {
    en: [
      "contact",
      "reach you",
      "reach zakaria",
      "get in touch",
      "hire you",
      "hire zakaria",
      "work with you",
      "work together",
      "collaborate",
    ],
    fr: [
      "contact",
      "contacter",
      "joindre",
      "embaucher",
      "engager",
      "recruter",
      "prendre contact",
      "travailler avec toi",
      "travailler avec vous",
      "collaborer",
    ],
    es: [
      "contacto",
      "contactar",
      "contactarte",
      "contactarlo",
      "contratar",
      "contratarte",
      "ponerme en contacto",
      "trabajar contigo",
      "trabajar con usted",
      "colaborar",
    ],
    darija: ["kifach n7wsslk", "3ayan nkhdm m3ak", "bghit nkhdm m3ak"],
  },
  github: {
    en: ["github", "git hub", "source code", "repo", "repos", "repository", "repositories"],
    fr: ["github", "depot", "code source"],
    es: ["github", "repositorio", "codigo fuente"],
  },
  instagram: {
    en: ["instagram", "insta"],
    fr: ["instagram", "insta"],
    es: ["instagram", "insta"],
  },
  email: {
    en: ["email", "e mail", "mail", "mail address"],
    fr: ["email", "e mail", "mail", "courriel", "adresse mail"],
    es: ["email", "e mail", "correo", "correo electronico"],
  },
  currentlyWorkingOn: {
    en: ["currently working", "working on now", "available", "availability", "open to work", "open to projects"],
    fr: ["actuellement", "disponible", "disponibilite", "en ce moment"],
    es: ["actualmente", "disponible", "disponibilidad", "en este momento", "ahora mismo"],
    darija: ["daba fach khdam", "wach mtach", "wach available"],
  },
};

const CONTENT_TOPICS_BY_PRIORITY: Topic[] = [
  "contact",
  "email",
  "github",
  "instagram",
  "currentlyWorkingOn",
  "education",
  "skills",
  "projects",
  "experience",
  "about",
];

const LANGS: Lang[] = ["en", "fr", "es", "darija"];

// ---------------------------------------------------------------------------
// Language detection — additional function words that are NOT topic keywords.
// Only words that are (near-)unique to one of the languages are listed;
// ambiguous ones ("de", "que", "me", "tu", "es", "on", "no") are omitted.
// ---------------------------------------------------------------------------

const LANG_MARKERS: Record<Lang, string[]> = {
  en: [
    "what", "whats", "are", "is", "your", "you", "how", "can", "could", "would", "tell", "about", "who", "where",
    "when", "which", "does", "did", "have", "has", "the", "and", "with", "this", "that", "please", "reach", "get",
    "know", "more", "show", "any", "do", "yourself", "like", "much", "many", "old", "favorite", "favourite", "live",
    "based", "from", "why", "want", "need", "charge", "hour", "of", "spain", "france", "coffee",
  ],
  fr: [
    "quelle", "quelles", "quel", "quels", "comment", "puis", "je", "tes", "ton", "ta", "vous", "votre", "vos", "moi",
    "parle", "parlez", "dis", "dites", "peux", "peut", "pouvez", "pourquoi", "avec", "quoi", "une", "des", "les",
    "du", "est", "sont", "suis", "mes", "ces", "cette", "qui", "sur", "dans", "montre", "montrez", "fais", "faites",
    "toi", "et", "ou", "aimes", "aime", "aimez", "combien", "quand", "pas", "ne", "il", "elle", "nous", "notre",
    "habites", "habitez", "travailles", "travaillez", "veux", "voudrais", "ans", "prefere", "capitale", "coute",
    "espagne", "france", "avez", "faire", "fait", "pourquoi", "merci",
  ],
  es: [
    "cual", "cuales", "como", "quien", "quienes", "donde", "cuando", "cuanto", "puedo", "puedes", "puede", "eres",
    "soy", "tus", "sus", "mis", "para", "con", "sobre", "el", "los", "las", "una", "del", "por", "favor", "pero",
    "muy", "tienes", "tiene", "quiero", "quisiera", "hablame", "cuentame", "dime", "muestrame", "dedicas", "haces",
    "ti", "gusta", "gustan", "anos", "cuantos", "cuanto", "cuantas", "favorita", "favorito", "comida", "vives",
    "hablas", "trabajas", "cobras", "precio", "cuesta", "quieres", "hago", "tengo", "usted", "ustedes", "nosotros",
    "ahora", "siempre", "nunca", "porque", "tambien", "mucho", "francia", "espana", "gracias",
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
  const tokens = tokenize(input);
  const tokenSet = new Set(tokens);
  const padded = pad(tokens);
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

  // Topic vocabulary is language-specific evidence too.
  for (const vocab of Object.values(TOPIC_KEYWORDS)) {
    for (const lang of LANGS) {
      for (const phrase of vocab[lang] ?? []) {
        if (hasPhrase(padded, phrase)) score[lang] += 1;
      }
    }
  }

  if (ARABIC_SCRIPT.test(input)) score.darija += 3;
  return score;
}

/**
 * Pick the language of `input`. Ties (including "no evidence at all") are
 * resolved in favour of `fallback` — the language the website is currently
 * displayed in — when it is among the leaders, otherwise en → fr → es.
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
// Topic detection
// ---------------------------------------------------------------------------

function scoreTopic(padded: string, topic: Topic): number {
  const vocab = TOPIC_KEYWORDS[topic];
  const seen = new Set<string>();
  let score = 0;
  for (const lang of LANGS) {
    for (const phrase of vocab[lang] ?? []) {
      const key = tokenize(phrase).join(" ");
      if (seen.has(key)) continue; // same folded phrase listed under two languages counts once
      if (hasPhrase(padded, phrase)) {
        seen.add(key);
        score += key.split(" ").length; // longer, more specific phrases outweigh single words
      }
    }
  }
  return score;
}

function detectTopic(input: string): Topic | null {
  const padded = pad(tokenize(input));

  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of CONTENT_TOPICS_BY_PRIORITY) {
    const score = scoreTopic(padded, topic);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  if (best) return best;

  // Pleasantries only when nothing more specific was asked.
  if (scoreTopic(padded, "thanks") > 0) return "thanks";
  if (scoreTopic(padded, "greeting") > 0) return "greeting";
  return null;
}

function firstNames(list: string[], count: number): string {
  return list.slice(0, count).join(", ");
}

function buildResponses(): Record<Topic, Record<AssistantLocale, string>> {
  const { name, alias, location, bio, experience: exp, skills, contact, currentlyWorkingOn, projects: projectList } =
    profile;

  const sampleProjects = firstNames(
    projectList.slice(0, 3).map((p) => p.title),
    3
  );
  const frontendSkills = firstNames([...skills.frontend], 4);
  const backendSkills = firstNames([...skills.backend], 3);
  const databaseSkills = firstNames([...skills.database], 2);

  return {
    greeting: {
      en: `Hi! I'm ${alias}'s assistant. Ask me about ${name.split(" ")[0]}'s experience, projects, skills, or how to get in touch.`,
      fr: `Bonjour ! Je suis l'assistant de ${alias}. Posez-moi des questions sur l'expérience, les projets, les compétences de ${name.split(" ")[0]}, ou comment le contacter.`,
      es: `¡Hola! Soy el asistente de ${alias}. Pregúntame sobre la experiencia, los proyectos o las habilidades de ${name.split(" ")[0]}, o cómo contactarlo.`,
      darija: `Salam! Ana l'assistant dyal ${alias}. Sowlni 3la l'expérience, les projets, wla les compétences dyal ${name.split(" ")[0]}, wla kifach tqder tcontacti.`,
    },
    about: {
      en: bio,
      fr: `${name}, qui travaille sous le nom ${alias}, est développeur full-stack basé à ${location}. Son travail couvre l'ensemble d'un vrai produit : interfaces frontend, logique backend, et la base de données dont tout dépend.`,
      es: `${name}, que trabaja bajo el nombre ${alias}, es desarrollador full-stack con base en ${location}. Su trabajo abarca todo lo que compone un producto real: interfaces frontend, lógica backend y la base de datos de la que todo depende.`,
      darija: `${name}, li khddam b ism ${alias}, howa full-stack developer f ${location}. Khddam 3la kolchi: frontend, backend, o database.`,
    },
    experience: {
      en: `${name} works independently as a full-stack developer (${alias}), based in ${location}. He owns projects end-to-end — from database design to the interface people actually use — and has shipped ${projectList.length} production-ready products across e-commerce, SaaS dashboards, real-estate platforms, and business sites.`,
      fr: `${name} travaille en indépendant en tant que développeur full-stack (${alias}), basé à ${location}. Il prend en charge les projets de bout en bout — de la conception de la base de données jusqu'à l'interface — et a livré ${projectList.length} produits prêts pour la production, allant du e-commerce aux tableaux de bord SaaS.`,
      es: `${name} trabaja de forma independiente como desarrollador full-stack (${alias}), con base en ${location}. Se encarga de los proyectos de principio a fin — desde el diseño de la base de datos hasta la interfaz — y ha entregado ${projectList.length} productos listos para producción, entre comercio electrónico, paneles SaaS y plataformas inmobiliarias.`,
      darija: `${name} khddam b rasso f full-stack development (${alias}), f ${location}. Kaydir kolchi mn database l'interface, o dar ${projectList.length} d les projets kaymchiw l production.`,
    },
    projects: {
      en: `${name} has built ${projectList.length} complete products, including ${sampleProjects}, and more. You'll find all of them in the Work section above, each with a full case study.`,
      fr: `${name} a réalisé ${projectList.length} produits complets, dont ${sampleProjects}, entre autres. Vous les trouverez tous dans la section Travaux ci-dessus, chacun avec une étude de cas complète.`,
      es: `${name} ha creado ${projectList.length} productos completos, incluyendo ${sampleProjects}, entre otros. Los encontrarás todos en la sección de Trabajos, cada uno con un caso de estudio completo.`,
      darija: `${name} dar ${projectList.length} projets kamlin, fihom ${sampleProjects}. Tql9ahom fi section "Work" f had page.`,
    },
    skills: {
      en: `On the frontend: ${frontendSkills}. On the backend: ${backendSkills}. For data: ${databaseSkills}. You can see the full toolkit in the Skills section above.`,
      fr: `Côté frontend : ${frontendSkills}. Côté backend : ${backendSkills}. Pour les données : ${databaseSkills}. La liste complète est visible dans la section Compétences ci-dessus.`,
      es: `En frontend: ${frontendSkills}. En backend: ${backendSkills}. Para datos: ${databaseSkills}. Puedes ver el conjunto completo en la sección de Habilidades.`,
      darija: `F frontend: ${frontendSkills}. F backend: ${backendSkills}. F data: ${databaseSkills}. Chof section "Skills" bach tchof kolchi.`,
    },
    education: {
      en: `That's not something listed on this portfolio. You can contact ${name.split(" ")[0]} directly if you'd like to know more.`,
      fr: `Ce n'est pas une information présente sur ce portfolio. Vous pouvez contacter ${name.split(" ")[0]} directement pour en savoir plus.`,
      es: `Eso no aparece en este portafolio. Puedes contactar a ${name.split(" ")[0]} directamente si quieres saber más.`,
      darija: `Hadchi mamawjoud f had portfolio. Tqder tcontacti ${name.split(" ")[0]} b nafso ila bghiti ta3rf ktar.`,
    },
    contact: {
      en: `Want to work with ${name.split(" ")[0]}? You can reach him at ${contact.email || "the email in the contact section"}, or use the contact section on this site.`,
      fr: `Envie de travailler avec ${name.split(" ")[0]} ? Vous pouvez le joindre à ${contact.email || "l'adresse indiquée dans la section contact"}, ou via la section contact de ce site.`,
      es: `¿Quieres trabajar con ${name.split(" ")[0]}? Puedes escribirle a ${contact.email || "el correo de la sección de contacto"}, o usar la sección de contacto de este sitio.`,
      darija: `Bghiti tkhdem m3a ${name.split(" ")[0]}? Tqder tcontactih fl email ${contact.email || "li kayn f section contact"}, wla mn section "Contact".`,
    },
    github: {
      en: contact.github
        ? `${name.split(" ")[0]}'s GitHub is ${contact.github}.`
        : `No public GitHub is listed. You can contact ${name.split(" ")[0]} directly for that.`,
      fr: contact.github
        ? `Le GitHub de ${name.split(" ")[0]} est ${contact.github}.`
        : `Aucun GitHub public n'est indiqué. Contactez ${name.split(" ")[0]} directement pour cela.`,
      es: contact.github
        ? `El GitHub de ${name.split(" ")[0]} es ${contact.github}.`
        : `No hay un GitHub público indicado. Contacta a ${name.split(" ")[0]} directamente para eso.`,
      darija: contact.github ? `GitHub dyal ${name.split(" ")[0]} howa ${contact.github}.` : `Makaynch GitHub 3lani. Contacti ${name.split(" ")[0]} b nafso.`,
    },
    instagram: {
      en: contact.instagram
        ? `You can find ${name.split(" ")[0]} on Instagram at ${contact.instagram}.`
        : `No Instagram is listed. You can contact ${name.split(" ")[0]} directly instead.`,
      fr: contact.instagram
        ? `Vous pouvez retrouver ${name.split(" ")[0]} sur Instagram : ${contact.instagram}.`
        : `Aucun Instagram n'est indiqué. Contactez ${name.split(" ")[0]} directement.`,
      es: contact.instagram
        ? `Puedes encontrar a ${name.split(" ")[0]} en Instagram: ${contact.instagram}.`
        : `No hay un Instagram indicado. Contacta a ${name.split(" ")[0]} directamente.`,
      darija: contact.instagram ? `Instagram dyal ${name.split(" ")[0]}: ${contact.instagram}.` : `Makaynch Instagram 3lani. Contacti ${name.split(" ")[0]} b nafso.`,
    },
    email: {
      en: contact.email
        ? `${name.split(" ")[0]}'s email is ${contact.email}.`
        : `No public email is listed — use the contact section on this site instead.`,
      fr: contact.email
        ? `L'e-mail de ${name.split(" ")[0]} est ${contact.email}.`
        : `Aucun e-mail public n'est indiqué — utilisez la section contact de ce site.`,
      es: contact.email
        ? `El correo de ${name.split(" ")[0]} es ${contact.email}.`
        : `No hay un correo público indicado — usa la sección de contacto de este sitio.`,
      darija: contact.email ? `Email dyal ${name.split(" ")[0]}: ${contact.email}.` : `Makaynch email 3lani. Khdem b section "Contact".`,
    },
    currentlyWorkingOn: {
      en: currentlyWorkingOn,
      fr: `Actuellement disponible pour de nouveaux projets full-stack — rendez-vous dans la section contact pour démarrer une conversation.`,
      es: `Actualmente disponible para nuevos proyectos full-stack — visita la sección de contacto para iniciar una conversación.`,
      darija: `Daba ${alias} disponible bach ydir des nouveaux projets — sift message f section "Contact".`,
    },
    thanks: {
      en: `You're welcome! Anything else you'd like to know about ${name.split(" ")[0]}'s work?`,
      fr: `Avec plaisir ! Souhaitez-vous savoir autre chose sur le travail de ${name.split(" ")[0]} ?`,
      es: `¡De nada! ¿Quieres saber algo más sobre el trabajo de ${name.split(" ")[0]}?`,
      darija: `Bla jmil! Kayn chi haja khra bghiti ta3rfha 3la ${name.split(" ")[0]}?`,
    },
  };
}

const RESPONSES = buildResponses();

const FALLBACK: Record<AssistantLocale, string> = {
  en: `I don't have that information. You can contact ${profile.name.split(" ")[0]} directly if you'd like to know more.`,
  fr: `Je n'ai pas cette information. Vous pouvez contacter ${profile.name.split(" ")[0]} directement pour en savoir plus.`,
  es: `No tengo esa información. Puedes contactar a ${profile.name.split(" ")[0]} directamente si quieres saber más.`,
  darija: `Ma3ndich had l'ma3loma. Tqder tcontacti ${profile.name.split(" ")[0]} b nafso ila bghiti ta3rf ktar.`,
};

const ERROR_MESSAGE: Record<AssistantLocale, string> = {
  en: `Something went wrong on my end. Please use the contact section to reach ${profile.name.split(" ")[0]} directly.`,
  fr: `Une erreur s'est produite de mon côté. Merci d'utiliser la section contact pour joindre ${profile.name.split(" ")[0]} directement.`,
  es: `Algo salió mal de mi lado. Usa la sección de contacto para escribir a ${profile.name.split(" ")[0]} directamente.`,
  darija: `Kayn chi mochkil. Khdem b section "Contact" bach tcontacti ${profile.name.split(" ")[0]}.`,
};

export type AssistantAnswer = {
  text: string;
  topic: Topic | "fallback";
  locale: AssistantLocale;
};

/**
 * @param siteLocale the language the website UI is currently in. Used only
 * when the question itself gives no language signal (e.g. "github", "cv").
 */
export function answerQuestion(input: string, siteLocale: AssistantLocale = "en"): AssistantAnswer {
  const locale = detectLanguage(input, siteLocale);
  const topic = detectTopic(input);

  if (!topic) {
    return { text: FALLBACK[locale], topic: "fallback", locale };
  }

  return { text: RESPONSES[topic][locale], topic, locale };
}

export function welcomeMessage(locale: AssistantLocale = "en"): string {
  return RESPONSES.greeting[locale];
}

export function errorMessage(locale: AssistantLocale = "en"): string {
  return ERROR_MESSAGE[locale];
}
