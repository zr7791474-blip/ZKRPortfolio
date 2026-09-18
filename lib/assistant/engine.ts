/**
 * ZKR portfolio assistant — answer engine.
 *
 * Deliberately NOT backed by a live LLM call: this project has no LLM API
 * key configured, and the brief is explicit that the assistant must never
 * invent information. A small deterministic intent-matcher over the real
 * facts in data/profile.ts guarantees every answer is traceable to real
 * portfolio content, and any unmatched question gets an honest
 * "I don't have that" fallback instead of a guess.
 */

import { profile } from "@/data/profile";

export type AssistantLocale = "en" | "fr" | "es" | "darija";

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

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  greeting: ["hello", "hi", "hey", "bonjour", "salut", "salam", "slm", "labas", "hola"],
  about: [
    "who are you",
    "who is zakaria",
    "about you",
    "about zakaria",
    "tell me about",
    "qui es-tu",
    "qui êtes-vous",
    "qui est zakaria",
    "quien eres",
    "quién es zakaria",
    "chkoun",
    "chkon nta",
    "3lach ana",
  ],
  experience: [
    "experience",
    "expérience",
    "experiencia",
    "career",
    "work history",
    "background",
    "khdamt",
    "khdma",
    "3andk experience",
  ],
  projects: [
    "project",
    "projects",
    "portfolio",
    "your work",
    "case study",
    "projet",
    "projets",
    "réalisations",
    "proyecto",
    "proyectos",
    "chnou dertihom",
    "chno dert",
    "dert chi projet",
  ],
  skills: [
    "skill",
    "skills",
    "technology",
    "technologies",
    "tech stack",
    "stack",
    "compétence",
    "compétences",
    "habilidad",
    "habilidades",
    "tecnologia",
    "ash ta3ref",
    "wach ta3ref",
    "3arf ash",
  ],
  education: [
    "education",
    "degree",
    "university",
    "school",
    "études",
    "diplôme",
    "école",
    "educacion",
    "educación",
    "universidad",
    "qraya",
    "fin qriti",
  ],
  contact: [
    "contact",
    "reach you",
    "get in touch",
    "hire you",
    "hire zakaria",
    "work with you",
    "contacter",
    "embaucher",
    "contactar",
    "contactarte",
    "kifach n7wsslk",
    "3ayan nkhdm m3ak",
    "bghit nkhdm m3ak",
  ],
  github: ["github", "git hub", "source code", "repo", "repository"],
  instagram: ["instagram", "insta"],
  email: ["email", "e-mail", "mail address", "correo"],
  currentlyWorkingOn: [
    "currently working",
    "working on now",
    "available",
    "disponible",
    "disponibilidad",
    "actuellement",
    "daba fach khdam",
    "wach mtach",
    "wach available",
  ],
  thanks: ["thank", "thanks", "merci", "gracias", "choukran", "shukran"],
};

// Order matters as a tie-breaker when two topics score equally.
const TOPIC_PRIORITY: Topic[] = [
  "greeting",
  "thanks",
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

function normalize(input: string): string {
  return ` ${input.toLowerCase().trim()} `;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Word-boundary match instead of a plain substring check — short keywords
 * like "nta" or "hi" would otherwise false-positive inside ordinary words
 * (e.g. "contact" contains "nta").
 */
function hasKeyword(text: string, keyword: string): boolean {
  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return pattern.test(text);
}

function detectTopic(input: string): Topic | null {
  const text = normalize(input);
  let best: Topic | null = null;
  let bestScore = 0;

  for (const topic of TOPIC_PRIORITY) {
    const keywords = TOPIC_KEYWORDS[topic];
    const score = keywords.reduce((acc, kw) => (hasKeyword(text, kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

const ARABIC_SCRIPT = /[\u0600-\u06FF]/;
const DARIJA_LATIN = [
  "wach",
  "kif",
  "kifach",
  "bghit",
  "chno",
  "chnou",
  "3lach",
  "mzyan",
  "mezyan",
  "labas",
  "salam",
  "choukran",
  "dyal",
  "3andk",
  "3andek",
  "nta",
  "nti",
  "hna",
  "daba",
];
const FRENCH_HINTS = [
  "bonjour",
  "salut",
  "comment",
  "être",
  "êtes",
  "es-tu",
  "quoi",
  "pourquoi",
  "merci",
  "contacter",
  "compétence",
  "expérience",
  "projet",
];
const SPANISH_HINTS = [
  "hola",
  "gracias",
  "cómo",
  "como estas",
  "quién",
  "quien",
  "qué",
  "que",
  "proyecto",
  "habilidad",
  "contactar",
  "experiencia",
];

export function detectLanguage(input: string): AssistantLocale {
  const text = normalize(input);
  if (ARABIC_SCRIPT.test(input)) return "darija";
  if (DARIJA_LATIN.some((w) => hasKeyword(text, w))) return "darija";
  if (FRENCH_HINTS.some((w) => hasKeyword(text, w))) return "fr";
  if (SPANISH_HINTS.some((w) => hasKeyword(text, w))) return "es";
  return "en";
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
      darija: `Salam! Ana l'assistant dyal ${alias}. Sowlni 3la l'expérience, les projets, wla les compétences dyal ${name.split(" ")[0]}, wla kifach tقdr tcontacti.`,
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

export type AssistantAnswer = {
  text: string;
  topic: Topic | "fallback";
  locale: AssistantLocale;
};

export function answerQuestion(input: string): AssistantAnswer {
  const locale = detectLanguage(input);
  const topic = detectTopic(input);

  if (!topic) {
    return { text: FALLBACK[locale], topic: "fallback", locale };
  }

  return { text: RESPONSES[topic][locale], topic, locale };
}

export function welcomeMessage(locale: AssistantLocale = "en"): string {
  return RESPONSES.greeting[locale];
}
