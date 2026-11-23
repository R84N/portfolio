/**
 * All the text on the page lives here, in both languages — edit this file,
 * not the components. Things that don't depend on language are in `shared`.
 */

export const shared = {
  short: 'misha',
  contacts: {
    email: 'misha3001011@gmail.com',
    telegram: 'https://t.me/MishaPopovych',
    linkedin: 'https://www.linkedin.com/in/misha-popovych-0126b22a6/',
  },
  stack: {
    Frontend: ['Vue 3', 'Nuxt', 'TypeScript', 'Pinia', 'Vue Router', 'Tailwind CSS', 'GSAP', 'Vite'],
    Backend: ['Node.js', 'Express', 'REST API', 'Prisma', 'PostgreSQL', 'Redis', 'WebSockets'],
    Tools: ['Docker', 'Git', 'Nginx', 'Linux / VPS', 'GitHub Actions', 'Figma'],
  } as Record<string, string[]>,
  // project order, links and tech — text for each is in the language blocks below
  projects: [
    { title: 'TheCoinEarn', link: 'https://thecoinearn.com', bonus: false, tech: ['Vue', 'Nuxt', 'Node.js'] },
    { title: 'SpaceWaydigit', link: '', bonus: false, tech: ['Vue', 'Nuxt', 'Node.js'] },
    { title: 'WayDigit', link: 'https://waydigit.com/', bonus: true, tech: ['WordPress'] },
  ],
}

// Titles are short trusted HTML: <br> for a line break, <em> for the green word.
const uk = {
  meta: {
    title: 'Михайло Попович — Full-stack Vue + Node',
    description: 'Full-stack розробник: Vue 3 / Nuxt на фронті, Node.js на бекенді. Сайти, SPA, API та автоматизація.',
  },
  name: 'Михайло Попович',
  nav: {
    about: 'Про мене',
    stack: 'Стек',
    projects: 'Проєкти',
    process: 'Процес',
    contact: 'Контакти',
    cta: 'Написати',
    menu: 'Меню',
  },
  hero: {
    eyebrow: 'Full-stack розробник · Україна · remote',
    // hero lines 2 and 3: <em> = Vue green, <em class="node"> = Node green
    line2: 'пишу на <em>Vue</em>',
    line3: 'і <em class="node">Node</em>',
    intro: 'Роблю вебзастосунки від першого екрана до бази даних: інтерфейси на Vue 3 та Nuxt, API на Node.js, деплой і автоматизацію навколо них.',
    primary: 'Дивитись проєкти →',
    secondary: 'Обговорити задачу',
  },
  pillars: [
    { n: '01', title: 'Frontend', text: 'Vue 3, Nuxt, TypeScript, Pinia. SSR/SSG, адаптивна верстка, анімації на GSAP.' },
    { n: '02', title: 'Backend', text: 'Node.js, Express, REST API, Prisma + PostgreSQL, Redis, авторизація, інтеграції.' },
    { n: '03', title: 'Ship it', text: 'Docker, CI/CD, деплой на VPS, моніторинг. Від ідеї до продакшену — одна людина.' },
  ],
  about: {
    eyebrow: '01 — про мене',
    title: 'Одна людина на<br><em>весь стек</em>',
    text: [
      'Я full-stack розробник, який найкраще почувається на зв’язці Vue + Node. Фронт пишу на Vue 3 / Nuxt з TypeScript, бекенд — на Node.js (Express, Prisma, PostgreSQL), а все разом пакую в Docker.',
      'Люблю, коли продукт не лише працює, а й відчувається: плавні анімації, швидке завантаження, зрозуміла адмінка.',
    ],
    facts: [
      { k: 'Фронт', v: 'Vue 3 · Nuxt' },
      { k: 'Бек', v: 'Node.js · Express' },
      { k: 'База', v: 'PostgreSQL · Prisma' },
      { k: 'Деплой', v: 'Docker · VPS' },
    ],
  },
  stack: {
    eyebrow: '02 — стек',
    title: 'Інструменти, якими<br>я <em>щодня</em> користуюсь',
  },
  projects: {
    eyebrow: '03 — проєкти',
    title: 'Проєкти, в яких<br>я <em>брав участь</em>',
    lead: 'Продукти, над якими я працював — від крипто-платформи до внутрішньої CRM і сайту агенції.',
    bonus: '+ бонус',
    items: [
      {
        tag: 'Full-stack · crypto',
        text: 'Платформа, що відстежує винагороди за стейкінг у реальному часі: тисячі пропозицій, рейтинги монет і платформ, калькулятор доходу, watchlist і портфель користувача.',
        features: ['Staking-калькулятор', 'Авторизація'],
      },
      {
        tag: 'Full-stack · CRM',
        text: 'CRM-система для IT-компанії: робочий простір команди для ведення клієнтів, проєктів і задач в одному місці.',
        features: ['Дашборди', 'Ролі й доступи'],
      },
      {
        tag: 'Сайт агенції',
        text: 'Сайт digital-агенції (SEO, веброзробка, SaaS): послуги, кейси, блог, відгуки та форма заявки. Практично весь сайт написав я. Так, це WordPress — і це плюс: вмію працювати не лише з Vue та Node.',
        features: ['SEO', 'Блог'],
      },
    ],
  },
  process: {
    eyebrow: '04 — процес',
    title: 'Від ідеї до <em>продакшену</em>',
    steps: [
      { n: '01', title: 'Розбираємо задачу', text: 'Що будуємо, для кого і як зрозуміти, що вийшло добре. Фіксую обсяг і терміни.' },
      { n: '02', title: 'Інтерфейс на Vue / Nuxt', text: 'Компоненти, стан, адаптив, анімації. SSR там, де важливі SEO і швидкість.' },
      { n: '03', title: 'API на Node.js', text: 'Схема бази, ендпоінти, валідація, авторизація, інтеграції з зовнішніми сервісами.' },
      { n: '04', title: 'Запуск і підтримка', text: 'Docker, деплой, домен, HTTPS, моніторинг. Далі — нові фічі й допомога.' },
    ],
  },
  contact: {
    eyebrow: '05 — контакти',
    title: 'Є проєкт?<br><em>Давай поговоримо.</em>',
    lead: 'Сайт, SPA, адмінка, API чи бот — розкажи, що треба, і я відповім протягом дня.',
    copy: 'Скопіювати email',
    copied: 'Скопійовано ✓',
  },
  footer: {
    built: ['Зроблено на', 'дим — WebGL'],
  },
}

type Content = typeof uk

const en: Content = {
  meta: {
    title: 'Misha Popovych — Full-stack Vue + Node developer',
    description: 'Full-stack developer: Vue 3 / Nuxt on the frontend, Node.js on the backend. Websites, SPAs, APIs and automation.',
  },
  name: 'Misha Popovych',
  nav: {
    about: 'About',
    stack: 'Stack',
    projects: 'Projects',
    process: 'Process',
    contact: 'Contact',
    cta: 'Get in touch',
    menu: 'Menu',
  },
  hero: {
    eyebrow: 'Full-stack developer · Ukraine · remote',
    line2: 'I build with',
    line3: '<em>Vue</em> & <em class="node">Node</em>',
    intro: 'I build web apps from the first screen down to the database: interfaces in Vue 3 and Nuxt, APIs in Node.js, plus the deployment and automation around them.',
    primary: 'See projects →',
    secondary: 'Discuss a project',
  },
  pillars: [
    { n: '01', title: 'Frontend', text: 'Vue 3, Nuxt, TypeScript, Pinia. SSR/SSG, responsive layouts, GSAP animations.' },
    { n: '02', title: 'Backend', text: 'Node.js, Express, REST APIs, Prisma + PostgreSQL, Redis, auth, integrations.' },
    { n: '03', title: 'Ship it', text: 'Docker, CI/CD, VPS deployment, monitoring. From idea to production — one person.' },
  ],
  about: {
    eyebrow: '01 — about',
    title: 'One person for<br><em>the whole stack</em>',
    text: [
      'I’m a full-stack developer who feels most at home with Vue + Node. I write the frontend in Vue 3 / Nuxt with TypeScript, the backend in Node.js (Express, Prisma, PostgreSQL), and ship it all in Docker.',
      'I like products that don’t just work but feel good: smooth animations, fast loading, an admin panel that makes sense.',
    ],
    facts: [
      { k: 'Frontend', v: 'Vue 3 · Nuxt' },
      { k: 'Backend', v: 'Node.js · Express' },
      { k: 'Database', v: 'PostgreSQL · Prisma' },
      { k: 'Deploy', v: 'Docker · VPS' },
    ],
  },
  stack: {
    eyebrow: '02 — stack',
    title: 'Tools I use<br><em>every day</em>',
  },
  projects: {
    eyebrow: '03 — projects',
    title: 'Projects<br>I’ve <em>worked on</em>',
    lead: 'Products I’ve been part of — from a crypto platform to an in-house CRM and an agency website.',
    bonus: '+ bonus',
    items: [
      {
        tag: 'Full-stack · crypto',
        text: 'A platform that tracks staking rewards in real time: thousands of offers, coin and platform rankings, an earnings calculator, a watchlist and a user portfolio.',
        features: ['Staking calculator', 'Authentication'],
      },
      {
        tag: 'Full-stack · CRM',
        text: 'A CRM system for an IT company: one workspace for the team to manage clients, projects and tasks.',
        features: ['Dashboards', 'Roles & permissions'],
      },
      {
        tag: 'Agency website',
        text: 'Website of a digital agency (SEO, web development, SaaS): services, case studies, blog, testimonials and a lead form. I built almost all of it. Yes, it’s WordPress — and that’s a plus: I’m not limited to Vue and Node.',
        features: ['SEO', 'Blog'],
      },
    ],
  },
  process: {
    eyebrow: '04 — process',
    title: 'From idea to <em>production</em>',
    steps: [
      { n: '01', title: 'Understand the task', text: 'What we’re building, for whom, and how we’ll know it worked. I pin down the scope and timeline.' },
      { n: '02', title: 'Interface in Vue / Nuxt', text: 'Components, state, responsive layout, animations. SSR where SEO and speed matter.' },
      { n: '03', title: 'API in Node.js', text: 'Database schema, endpoints, validation, auth, integrations with external services.' },
      { n: '04', title: 'Launch & support', text: 'Docker, deployment, domain, HTTPS, monitoring. Then new features and ongoing help.' },
    ],
  },
  contact: {
    eyebrow: '05 — contact',
    title: 'Got a project?<br><em>Let’s talk.</em>',
    lead: 'A website, SPA, admin panel, API or bot — tell me what you need and I’ll reply within a day.',
    copy: 'Copy email',
    copied: 'Copied ✓',
  },
  footer: {
    built: ['Built with', 'smoke — WebGL'],
  },
}

export const content = { uk, en }
export type Locale = keyof typeof content
