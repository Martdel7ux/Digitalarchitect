/* ========================================================================
   DM-01 KNOWLEDGE BASE — everything the "Get to Know Me" assistant knows.

   Each topic has:
   - keywords: words or short phrases that trigger it. Longer phrases win
     over single words, so "are you ai" beats "ai".
   - answers:  one or more replies (a random one is picked, so repeats feel
     less robotic). Keep them short — they show in a speech bubble.
   - next:     optional follow-up chips shown after this answer.

   To teach it something new, add a topic. No AI or API key involved: it
   only ever says what's written here.
   ======================================================================== */

export type Topic = {
  id: string;
  keywords: string[];
  answers: string[];
  next?: string[];
};

export const DEFAULT_SUGGESTIONS = [
  'Who is Dela?',
  'What can Dela build for me?',
  "What's Dela's tech stack?",
  'How does Dela work?',
  'Is Dela available for projects?',
];

const FALLBACKS = [
  "Hmm, that one isn't in my notes. I know Dela's skills, projects, process and availability. Try one of those, or ask Dela directly in Let's Cook below.",
  "Good question, but I don't have an answer for it. For anything beyond the portfolio, Dela's best reached through Let's Cook further down.",
  "I'm drawing a blank on that one. Ask me about Dela's projects, tech stack or how a project with Dela runs, or ask Dela directly in Let's Cook.",
];

export const TOPICS: Topic[] = [
  /* ---------------------------- small talk ----------------------------- */
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'yo', 'sup', 'hiya', 'good morning', 'good afternoon', 'good evening', 'whats up'],
    answers: [
      "Hey there! 👋 What would you like to know about Dela?",
      "Hello! Ask me anything about Dela's work, skills or projects.",
    ],
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'cheers', 'appreciate', 'awesome', 'cool', 'nice', 'great', 'perfect'],
    answers: [
      "Anytime! If you're ready to build something, head to Let's Cook and book a discovery call with Dela.",
      "Glad that helped! Anything else you'd like to know about Dela?",
    ],
    next: ['Is Dela available for projects?', 'Show me some projects'],
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'cya'],
    answers: ["See you around! Don't forget Let's Cook if you have a project in mind. 🔥"],
  },
  {
    id: 'bot',
    keywords: ['who are you', 'what are you', 'are you a bot', 'are you real', 'are you human', 'are you ai', 'are you dela', 'bot', 'robot', 'dm-01', 'dm 01', 'chatbot'],
    answers: [
      "I'm DM-01, Dela's portfolio assistant. I'm not Dela and I'm not a live AI. I answer from what's on this portfolio. For a real conversation, Let's Cook gets you straight to Dela.",
    ],
    next: DEFAULT_SUGGESTIONS.slice(0, 3),
  },

  /* ------------------------------ identity ----------------------------- */
  {
    id: 'who',
    keywords: ['who is dela', 'who', 'about dela', 'tell me about dela', 'introduce', 'background', 'bio', 'yourself', 'tell me about yourself'],
    answers: [
      "Dela is a digital architect based in Nicosia, Cyprus, who designs and builds websites, software and mobile apps end to end. With a BSc in Management Information Systems, Dela sits right between business and technology, so the build always serves a real goal.",
    ],
    next: ['What can Dela build for me?', 'What drives Dela?', 'Show me some projects'],
  },
  {
    id: 'name',
    keywords: ['name', 'full name', 'real name', 'martin', 'ahoto', 'called'],
    answers: [
      "Dela's full name is Martin Ahoto, but on here it's simply Dela, The Digital Architect.",
    ],
    next: ['Who is Dela?', 'How can I contact Dela?'],
  },
  {
    id: 'location',
    keywords: ['where', 'based', 'location', 'located', 'where does dela live', 'country', 'city', 'cyprus', 'nicosia', 'remote', 'timezone'],
    answers: [
      "Dela is based in Nicosia, Cyprus. To work together from elsewhere, just reach out through Let's Cook.",
    ],
    next: ['Is Dela available for projects?', 'How does Dela work?'],
  },
  {
    id: 'education',
    keywords: ['study', 'studied', 'degree', 'education', 'university', 'school', 'college', 'bsc', 'mis', 'management information systems', 'qualification', 'graduate'],
    answers: [
      "Dela holds a BSc in Management Information Systems. It's a mix of business and tech, which is why Dela always asks why something should be built, not just how.",
    ],
    next: ["What's Dela's tech stack?", 'What drives Dela?'],
  },
  {
    id: 'why',
    keywords: ['why', 'passion', 'passionate', 'motivate', 'motivation', 'drive', 'drives', 'love', 'inspire', 'inspiration', 'purpose', 'what drives dela'],
    answers: [
      "Dela loves making ideas real. Design decides how something feels, code decides how it works, and Dela refuses to choose between them. The goal is products that outlive the brief, where people think \"this just works\".",
    ],
    next: ['How does Dela work?', 'Show me some projects'],
  },
  {
    id: 'personality',
    keywords: ['personality', 'like to work with', 'vibe', 'character', 'kind of person', 'describe dela', 'values', 'working with dela'],
    answers: [
      "Curious, direct and a little obsessed with the details most people skip. Dela treats every client project like their own and keeps communication clear the whole way through.",
    ],
    next: ['How does Dela work?', 'Is Dela available for projects?'],
  },

  /* ------------------------------ services ----------------------------- */
  {
    id: 'services',
    keywords: ['what can dela build', 'services', 'service', 'offer', 'build', 'make', 'create', 'help', 'what does dela do', 'speciality', 'specialty', 'specialize'],
    answers: [
      "Dela offers three things: website design & development, mobile app development and custom software. That covers brand-driven sites through to full product builds. If it lives on a screen, Dela can architect it end to end.",
    ],
    next: ['Tell me about websites', 'Tell me about mobile apps', 'Tell me about software'],
  },
  {
    id: 'websites',
    keywords: ['website', 'websites', 'web', 'site', 'landing page', 'tell me about websites', 'wordpress', 'ecommerce', 'e-commerce', 'online store', 'shop', 'woocommerce', 'redesign'],
    answers: [
      "Websites are a big part of Dela's work: marketing sites, landing pages and e-commerce stores, hand-coded in HTML, CSS and JavaScript or built on WordPress & WooCommerce. Examples include SCI Physical Academy, CLTAP and Sheabliss Cosmetics.",
    ],
    next: ['Tell me about Sheabliss', 'Tell me about SCI Physical Academy', 'How does Dela work?'],
  },
  {
    id: 'mobile',
    keywords: ['mobile', 'app', 'apps', 'mobile app', 'tell me about mobile apps', 'ios', 'android', 'react native', 'android studio', 'phone'],
    answers: [
      "Yes, Dela builds mobile apps with React Native and Android Studio, from first design through to a working product on real devices.",
    ],
    next: ["What's Dela's tech stack?", 'How does Dela work?'],
  },
  {
    id: 'software',
    keywords: ['software', 'tell me about software', 'database', 'system', 'dashboard', 'backend', 'internal tool', 'web app', 'application', 'automation', 'api', 'apis', 'integration'],
    answers: [
      "Dela builds custom software and web apps too: databases, dashboards and API integrations, working with C#, .NET, C++ and SQL. One example is the Off Campus Accommodation Database for the University of Nicosia.",
    ],
    next: ['Tell me about the accommodation database', "What's Dela's tech stack?"],
  },

  /* ------------------------------- skills ------------------------------ */
  {
    id: 'stack',
    keywords: ['stack', 'tech stack', 'tech', 'technologies', 'technology', 'languages', 'language', 'tools', 'skills', 'programming', 'code', 'coding', 'frameworks', 'c#', 'c++', '.net', 'sql', 'javascript', 'html', 'css', 'oracle', 'access'],
    answers: [
      "Dela's toolkit: C++, C# and .NET for backend work; SQL, Microsoft Access and Oracle Cloud for databases; HTML, CSS, JavaScript and WordPress for the web; React Native and Android Studio for mobile. Add API integration, performance optimisation and SEO fundamentals.",
    ],
    next: ['What soft skills does Dela have?', 'Show me some projects'],
  },
  {
    id: 'softskills',
    keywords: ['soft skills', 'soft skill', 'strengths', 'strength', 'communication', 'leadership', 'teamwork', 'deadlines', 'organised', 'organized', 'professional skills', 'what soft skills'],
    answers: [
      "Dela's strongest professional skills: clear communication with technical and non-technical people, close attention to detail, a structured approach, solid time management, taking ownership of projects, and constantly learning.",
    ],
    next: ["What's Dela's tech stack?", 'How does Dela work?'],
  },
  {
    id: 'seo',
    keywords: ['seo', 'google ranking', 'search engine', 'performance', 'speed', 'fast website'],
    answers: [
      "Dela builds with performance optimisation and SEO fundamentals in mind, so sites load fast and give search engines what they need.",
    ],
    next: ['Tell me about websites'],
  },

  /* ------------------------------ process ------------------------------ */
  {
    id: 'process',
    keywords: ['process', 'how does dela work', 'how do you work', 'approach', 'workflow', 'steps', 'method', 'methodology', 'phases', 'stages', 'work with'],
    answers: [
      "Every project follows five phases: Discovery (goals and the real problem), Strategy (architecture and roadmap), Design (wireframes to polished UI), Build & Test (clean code, tested on real devices) and Launch & Support. Dela sticks around after launch too.",
    ],
    next: ['How long does a project take?', 'How much does it cost?', 'Is Dela available for projects?'],
  },
  {
    id: 'support',
    keywords: ['support', 'maintenance', 'after launch', 'maintain', 'updates', 'hosting'],
    answers: [
      "Launch isn't the finish line for Dela. Support is the last phase of every project, making sure what's built keeps performing after launch day.",
    ],
    next: ['How does Dela work?'],
  },

  /* ------------------------------ projects ----------------------------- */
  {
    id: 'projects',
    keywords: ['projects', 'project', 'portfolio', 'examples', 'example', 'previous work', 'past work', 'case study', 'show me', 'show me some projects', 'built before', 'clients'],
    answers: [
      "A few highlights: the Off Campus Accommodation Database for the University of Nicosia, a marketing site for SCI Physical Academy, a landing page for the CLTAP legal teaching certificate, and the Sheabliss Cosmetics online store. They're all in the Projects section above.",
    ],
    next: ['Tell me about the accommodation database', 'Tell me about Sheabliss', 'Tell me about CLTAP'],
  },
  {
    id: 'project-accommodation',
    keywords: ['accommodation', 'accommodation database', 'housing', 'off campus', 'unic', 'university of nicosia', 'tell me about the accommodation database'],
    answers: [
      "The Off Campus Accommodation Database is an in-house web app that helps the University of Nicosia accommodation office manage verified off-campus housing in one place. Built with JavaScript, HTML, CSS and SQL. The code is on Dela's GitHub.",
    ],
    next: ['Tell me about software', 'Show me some projects'],
  },
  {
    id: 'project-sci',
    keywords: ['sci', 'sci physical academy', 'physical academy', 'gym', 'fitness', 'training academy', 'tell me about sci physical academy'],
    answers: [
      "SCI Physical Academy is a bold marketing site for a physical training academy, designed to turn visitors into members. Hand-built in HTML and CSS, and you can see it live from the Projects section.",
    ],
    next: ['Tell me about Sheabliss', 'Show me some projects'],
  },
  {
    id: 'project-cltap',
    keywords: ['cltap', 'legal', 'legal teaching', 'certificate', 'course', 'academic practice', 'tell me about cltap'],
    answers: [
      "CLTAP, the Certificate in Legal Teaching & Academic Practice, needed a landing page to market the course and drive enrolments. Dela built it on WordPress, and it's live at cltap.cy.",
    ],
    next: ['Tell me about Sheabliss', 'Show me some projects'],
  },
  {
    id: 'project-sheabliss',
    keywords: ['sheabliss', 'shea', 'shea butter', 'cosmetics', 'skincare', 'beauty', 'tell me about sheabliss'],
    answers: [
      "Sheabliss Cosmetics is an e-commerce store for a business that makes and sells shea-butter cosmetics. Built on WordPress & WooCommerce and live at sheablisscosmetics.com.",
    ],
    next: ['Tell me about SCI Physical Academy', 'Can Dela build my online store?'],
  },
  {
    id: 'experience',
    keywords: ['experience', 'experienced', 'years', 'how many projects', 'track record', 'how long have', 'completed', 'senior'],
    answers: [
      "Dela has completed 20+ projects, from brand-driven websites to full product builds across web, software and mobile.",
    ],
    next: ['Show me some projects', 'How does Dela work?'],
  },

  /* ------------------------------ business ----------------------------- */
  {
    id: 'availability',
    keywords: ['available', 'availability', 'hire', 'hiring', 'freelance', 'freelancer', 'open to', 'taking clients', 'new projects', 'start', 'is dela available for projects', 'work together', 'job', 'collaborate'],
    answers: [
      "Good timing: Dela is currently open to new projects! 🔥 Head to Let's Cook below, share what you're building and book a free discovery call.",
    ],
    next: ['How does Dela work?', 'How much does it cost?'],
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'costs', 'rate', 'rates', 'budget', 'charge', 'quote', 'how much', 'how much does it cost', 'fee', 'fees', 'expensive', 'cheap', 'afford'],
    answers: [
      "Pricing depends on the scope of what you're building, so Dela doesn't use one fixed rate. The quickest way to a real number is a free discovery call. Book one in Let's Cook below.",
    ],
    next: ['How long does a project take?', 'How does Dela work?'],
  },
  {
    id: 'timeline',
    keywords: ['how long', 'timeline', 'duration', 'turnaround', 'weeks', 'months', 'deadline', 'quickly', 'how long does a project take', 'when can'],
    answers: [
      "That depends on the project. A landing page moves a lot faster than a full app. Dela maps out the timeline in the Discovery and Strategy phases, so you'll know exactly what to expect before the build starts.",
    ],
    next: ['How much does it cost?', 'Is Dela available for projects?'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'reach', 'email', 'call', 'message', 'talk', 'get in touch', 'how can i contact dela', 'phone number', 'whatsapp', 'book', 'meeting', 'discovery call', 'calendly'],
    answers: [
      "The best way is Let's Cook, just below: tell Dela about your project and book a free discovery call straight away. You can also find Dela on LinkedIn, GitHub, Instagram and Facebook in Let's Connect at the bottom.",
    ],
    next: ['Is Dela available for projects?', 'How much does it cost?'],
  },
  {
    id: 'socials',
    keywords: ['linkedin', 'instagram', 'facebook', 'github', 'socials', 'social media', 'social', 'follow'],
    answers: [
      "Dela's on LinkedIn (Martin Ahoto), GitHub (Martdel7ux), Instagram (@delamarttin) and Facebook (Dela Martin). All the links are in Let's Connect at the bottom of the page.",
    ],
    next: ['How can I contact Dela?'],
  },

  /* ------------------------------ opinions ----------------------------- */
  {
    id: 'thoughts',
    keywords: ['thoughts', 'blog', 'article', 'articles', 'write', 'writing', 'opinion', 'opinions', 'taste', 'digital architect'],
    answers: [
      "Dela writes about technology, AI and building in My Thoughts. Recent pieces cover whether AI will replace developers, why taste is the last moat, and why every business will need a digital architect.",
    ],
    next: ["What's Dela's take on AI?", 'Who is Dela?'],
  },
  {
    id: 'ai',
    keywords: ['ai', 'artificial intelligence', 'chatgpt', 'replace developers', 'take on ai', "what's dela's take on ai", 'future', 'automation replace'],
    answers: [
      "Dela's take: AI is leverage, not replacement. It speeds up typing code, but deciding what to build, what to leave out and why still takes human judgment. That's the part Dela cares about most.",
    ],
    next: ['What else does Dela write about?', 'How does Dela work?'],
  },
];

/* ------------------------------ Matcher -------------------------------- */

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9#+.\-\s]/g, ' ')
    .split(/\s+/)
    .map((t) => (t === '.net' ? t : t.replace(/^[.\-]+|[.\-]+$/g, '')))
    .filter(Boolean);
}

// Very light stemming so "projects" matches "project", "apps" matches "app".
function stem(token: string): string {
  return token.length > 3 && token.endsWith('s') && !token.endsWith('ss')
    ? token.slice(0, -1)
    : token;
}

const stemmed = (text: string) => ` ${normalize(text).map(stem).join(' ')} `;

// Pre-compute stemmed keywords once.
const INDEX = TOPICS.map((topic) => ({
  topic,
  keys: topic.keywords.map((k) => ({ text: stemmed(k), weight: normalize(k).length })),
}));

const lastPick = new Map<string, number>();

function pick(id: string, options: string[]): string {
  if (options.length === 1) return options[0];
  let i = Math.floor(Math.random() * options.length);
  if (i === lastPick.get(id)) i = (i + 1) % options.length;
  lastPick.set(id, i);
  return options[i];
}

export type Reply = { text: string; next: string[] };

export function findAnswer(question: string): Reply {
  const q = stemmed(question);
  let best: Topic | null = null;
  let bestScore = 0;

  for (const { topic, keys } of INDEX) {
    let score = 0;
    for (const k of keys) {
      // Phrases count more than single words, so specific beats generic.
      if (q.includes(k.text)) score += k.weight * k.weight;
    }
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }

  if (!best) return { text: pick('fallback', FALLBACKS), next: DEFAULT_SUGGESTIONS };
  return { text: pick(best.id, best.answers), next: best.next ?? DEFAULT_SUGGESTIONS };
}
