# Портфоліо — Nuxt 4 + Vue 3

Лендинг-портфоліо full-stack (Vue + Node) розробника. Анімації перенесені зі старого проєкту `element-main` і перефарбовані в зелений:

- **Дим від курсора** — WebGL fluid simulation: `app/composables/useFluid.ts`, `app/components/SmokeCanvas.client.vue`
- **Світлячки на фоні** — `app/components/Fireflies.client.vue`
- **Кільце-курсор** (GSAP) — `app/components/CursorFollower.client.vue`
- **Плавний скрол** (Lenis + ScrollTrigger) — `app/composables/useSmoothScroll.ts`

Весь текст (ім'я, проєкти, стек, контакти) українською та англійською — в `app/data/profile.ts`.
Мови: українська на `/`, англійська на `/en` (`@nuxtjs/i18n`, перемикач UA/EN у навбарі).

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # статичний сайт у .output/public → будь-який хостинг (Vercel, Netlify, GitHub Pages)
```
