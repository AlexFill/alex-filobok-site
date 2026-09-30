/**
 * Everything the site says about Alex, in one place. Every claim here was
 * checked against his CV; keep it that way. v2 feeds this file to the voice
 * agent as its knowledge base, so it must stay factual and self-contained.
 */

export type Platform = 'ios' | 'macos' | 'web';

export interface Entry {
  id: string;
  /** Optional headline figure, e.g. "93%". */
  big?: string;
  title: string;
  body: string;
}

/** A company mark. `mask` logos are single-color SVGs that take the text color; `image` logos keep their own colors. */
export interface Logo {
  src: string;
  kind: 'mask' | 'image';
}

export interface ChapterLink {
  label: string;
  href: string;
}

export interface Chapter {
  id: string;
  platform: Platform;
  era: string;
  company: string;
  where: string;
  roles: string[];
  /** Tools used in this chapter, most relevant first. */
  tags: string[];
  logo?: Logo;
  links?: ChapterLink[];
  entries: Entry[];
}

export interface Link {
  label: string;
  handle?: string;
  href: string;
  icon: 'linkedin' | 'appstore' | 'github' | 'x' | 'instagram' | 'telegram';
}

export const identity = {
  name: 'Alex Filobok',
  title: 'Full-Stack Product Engineer',
  location: 'Warsaw, Poland',
  availability: 'Open to remote work',
  email: 'alexfill.af@gmail.com',
  siteUrl: 'https://alexfilobok.vercel.app',
  summary:
    'Product engineer with nine years of experience shipping software people use, from iPhone apps to macOS security features to full-stack TypeScript.',
  education: {
    degree: 'BSc in Computer Science and Applied Mathematics',
    school: 'Igor Sikorsky Kyiv Polytechnic Institute',
    years: '2012 – 2016',
  },
};

/** Turn on once github.com/AlexFill has public work to show. */
export const showGitHub = false;

export const links: Link[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-filobok/', icon: 'linkedin' },
  { label: 'NextXI on the App Store', href: 'https://apps.apple.com/us/app/nextxi-fpl/id6756494301', icon: 'appstore' },
  { label: 'X', handle: '@alex_filobok', href: 'https://x.com/alex_filobok', icon: 'x' },
  { label: 'Instagram', handle: '@alexfill.af', href: 'https://www.instagram.com/alexfill.af/', icon: 'instagram' },
  { label: 'Telegram', handle: '@alexfill', href: 'https://t.me/alexfill', icon: 'telegram' },
  ...(showGitHub ? [{ label: 'GitHub', href: 'https://github.com/AlexFill', icon: 'github' as const }] : []),
];

/** The three acts of the hero's device morph. */
export const journey = [
  {
    platform: 'ios' as Platform,
    caption: 'It started on a phone.',
    years: '2017 – 2022',
    label: 'iOS',
    line: 'From intern to iOS team lead, across three companies in Kyiv.',
  },
  {
    platform: 'macos' as Platform,
    caption: 'Then it moved to the desktop.',
    years: '2022 – 2025',
    label: 'macOS',
    line: 'Four security features at MacPaw, shipped to a product with 30M+ users.',
  },
  {
    platform: 'web' as Platform,
    caption: 'Now it’s the whole stack.',
    years: '2025 – now',
    label: 'Full stack',
    line: 'NextXI, the app I co-founded: React Native, Supabase and Python. TypeScript and React on the web. iOS and performance work at Google.',
  },
];

export const chapters: Chapter[] = [
  {
    id: 'google',
    tags: ['Python', 'C++', 'Swift', 'Objective-C', 'OpenID Connect'],
    logo: { src: '/logos/google.svg', kind: 'mask' },
    platform: 'web',
    era: 'Full stack',
    company: 'Google',
    where: 'Warsaw, June 2025 – now',
    roles: ['SoC Performance Evaluation Software Engineer', 'iOS Engineer, 20% project on Gemini Enterprise'],
    entries: [
      {
        id: 'google-benchmarks',
        big: '93%',
        title: 'Faster benchmark runs',
        body: 'Cut benchmark execution from 180 s to 12 s while keeping the results reliable, brought 3 critical cloud benchmarks up in the emulation environment, and enabled critical workloads on the new platforms.',
      },
      {
        id: 'google-tooling',
        title: 'From firmware data to decisions',
        body: 'Built an automated benchmarking tool with charts that turns results across firmware and kernel variants into tuning recommendations for hardware and software teams.',
      },
      {
        id: 'google-oidc',
        big: '1 tap',
        title: 'Enterprise sign-in on iOS',
        body: 'Added Microsoft OpenID Connect sign-in to the Gemini Enterprise iOS app: token acquisition and exchange for a Google credential, behind a single tap. Shipped to internal users.',
      },
    ],
  },
  {
    id: 'macpaw',
    tags: ['Swift', 'AppKit', 'Objective-C', 'GitHub Actions', 'Fastlane'],
    logo: { src: '/logos/macpaw.svg', kind: 'mask' },
    links: [
      { label: 'MacPaw', href: 'https://macpaw.com' },
      { label: 'Moonlock', href: 'https://macpaw.com/moonlock' },
    ],
    platform: 'macos',
    era: 'macOS',
    company: 'MacPaw',
    where: 'Remote, August 2022 – June 2025',
    roles: ['macOS Software Engineer'],
    entries: [
      {
        id: 'macpaw-features',
        big: '30M+',
        title: 'Security features people use',
        body: 'Designed, documented and shipped four features for a cybersecurity product with 30M+ users: Mail Attachments Scanning, Detection History, Schedules and Quarantine. They later powered Moonlock, MacPaw’s standalone security app.',
      },
      {
        id: 'macpaw-release',
        title: 'Release infrastructure',
        body: 'Owned distribution: GitHub Actions and Fastlane with stable and unstable channels, plus a custom cross-version test harness for the system extension.',
      },
    ],
  },
  {
    id: 'promova',
    tags: ['HTML/CSS/JS', 'Node.js', 'Swift', 'UIKit', 'Combine', 'Firebase', 'Fastlane'],
    logo: { src: '/logos/promova.png', kind: 'image' },
    links: [
      { label: 'Promova', href: 'https://promova.com' },
      { label: 'App Store', href: 'https://apps.apple.com/us/app/promova-language-learning-app/id1460782849' },
    ],
    platform: 'ios',
    era: 'iOS',
    company: 'Promova',
    where: 'Kyiv, February 2020 – July 2022',
    roles: ['iOS Team Lead, 2021 – 2022', 'Senior iOS Software Engineer, 2020 – 2021', 'Middle iOS Software Engineer, 2020'],
    entries: [
      {
        id: 'promova-voice',
        big: '20M+',
        title: 'Real-time voice feedback',
        body: 'Led the mobile integration of AI pronunciation feedback: PocketSphinx on the device turned speech into phonemes for backend ML scoring, across hundreds of thousands of daily voice interactions in an app with 20M+ downloads.',
      },
      {
        id: 'promova-paywalls',
        big: '3 teams',
        title: 'Paywalls without app releases',
        body: 'Built a web-based paywall framework: HTML, CSS and JavaScript screens served remotely and wired to native purchases through a JavaScript bridge, so new variants went live and were A/B tested without an app release. Three iOS teams adopted it.',
      },
      {
        id: 'promova-performance',
        big: '−50%',
        title: 'Faster startup, faster builds',
        body: 'Halved app startup by moving to the Needle DI system, made builds nearly 6× faster with Jenkins and Fastlane, and raised test coverage on critical paths from 15% to about 55%.',
      },
      {
        id: 'promova-crm',
        big: '−50%',
        title: 'Faster lesson delivery',
        body: 'Designed a content CRM for the Content team on Airtable, Node.js and Firebase functions, cutting lesson delivery time by more than half, with validation that stops broken lessons from shipping.',
      },
      {
        id: 'promova-team',
        big: '0 → 3',
        title: 'Built the iOS team',
        body: 'Built the iOS team from scratch and mentored two engineers to mid-level. Led the move from Firebase to an in-house backend with the ML, Android, frontend and backend teams, and built a Node.js lesson-export API for the apps.',
      },
    ],
  },
  {
    id: 'developex',
    tags: ['Swift', 'RxSwift', 'MVVM', 'Objective-C'],
    platform: 'ios',
    era: 'iOS',
    company: 'DevelopEx',
    where: 'Kyiv, April 2018 – February 2020',
    roles: ['Middle iOS Developer, 2019 – 2020', 'Junior iOS Developer, 2018 – 2019'],
    entries: [
      {
        id: 'developex-bluetooth',
        big: '0 → 1',
        title: 'A Bluetooth companion app',
        body: 'Led development of an assistant app for a Bluetooth device from scratch in Swift, MVVM and RxSwift, and wrote the documentation that cut ramp-up time for new engineers by 30%.',
      },
      {
        id: 'developex-chat',
        big: '60 fps',
        title: 'A faster chat',
        body: 'Migrated the main chat screen from Objective-C to Swift, holding 60 fps and cutting the time to add new message types by at least half.',
      },
      {
        id: 'developex-swift',
        title: 'Objective-C to Swift',
        body: 'Spearheaded the move from Objective-C to Swift by independently designing and implementing a new feature.',
      },
    ],
  },
  {
    id: 'softheme',
    tags: ['Objective-C', 'Core Data', 'UIKit'],
    platform: 'ios',
    era: 'The start',
    company: 'Softheme',
    where: 'Kyiv, January 2017 – April 2018',
    roles: ['Junior iOS Developer, 2017 – 2018', 'iOS Intern, 2017'],
    entries: [
      {
        id: 'softheme-app',
        big: '−50%',
        title: 'A new app from scratch',
        body: 'Built a new application with a middle engineer using MVC and Core Data. Masonry layouts sped up UI development by about half, and Quickblox added real-time chat.',
      },
      {
        id: 'softheme-internship',
        title: 'Learning the craft',
        body: 'A three-month iOS internship in Objective-C, covering Core Data, concurrency and UIKit, ending in a final project that pulled data from an API into several screens.',
      },
    ],
  },
];

export const nextxi = {
  name: 'NextXI',
  role: 'Co-founder, April 2025 – now',
  body: 'A Fantasy Premier League planner for iOS and Android. I built the mobile app in React Native and TypeScript, its backend on Supabase, a Python optimization service that plans transfers, and our metrics dashboard. My co-founder built the web app.',
  stats: [
    { value: '2,200+', label: 'first-time iOS downloads' },
    { value: '2', label: 'platforms, one codebase' },
  ],
  tags: ['TypeScript', 'React Native', 'Expo', 'Supabase', 'Postgres', 'Python', 'FastAPI', 'Next.js'],
  appStore: 'https://apps.apple.com/us/app/nextxi-fpl/id6756494301',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.nextxi.fpl&hl=en',
};

/** Tags that prove web depth; the page emphasizes them. */
export const webTags: ReadonlySet<string> = new Set(['TypeScript', 'React', 'Next.js', 'React Native', 'HTML/CSS/JS', 'Node.js']);

/** The one-line stack summary shown after the chapters. */
export const stack = {
  today: ['TypeScript', 'React', 'Next.js', 'React Native', 'Node.js', 'Supabase', 'Python'],
  before: 'Before that, nine years of Swift and Objective-C across iOS and macOS. The tags under each chapter show where each tool was used.',
};

export const education = {
  degree: {
    ...identity.education,
    extra: 'Completed Harvard’s CS50 while at university.',
  },
  learning: {
    name: 'Machine Learning Crash Course',
    by: 'Google',
    href: 'https://developers.google.com/machine-learning/crash-course',
    body: 'Google’s course on how models learn, from regression to neural networks and embeddings. I’m working through it to understand how today’s AI works under the hood.',
  },
};

export const inProgress = {
  name: 'Captain’s Call',
  status: 'In progress',
  body: 'A voice assistant for your Fantasy Premier League team, built on ElevenLabs Agents. The agent shows its working on a pitch as it talks.',
};

/** What the voice guide will do once it's switched on (v2). */
export const guideAbilities = ['Answer questions about my work', 'Read my CV aloud', 'Sing my career', 'Tell it as a fantasy tale'];
