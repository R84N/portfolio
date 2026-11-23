// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],

  // make `nuxt generate` always output both language versions
  nitro: {
    prerender: { routes: ['/', '/en'] },
  },

  // Ukrainian at "/", English at "/en". The page text itself lives in app/data/profile.ts.
  i18n: {
    baseUrl: 'https://portfolio-iota-one-54.vercel.app', // change when you connect your own domain
    locales: [
      { code: 'uk', language: 'uk-UA', name: 'UA' },
      { code: 'en', language: 'en-US', name: 'EN' },
    ],
    defaultLocale: 'uk',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      redirectOn: 'root',
      // must be the default locale: during `nuxt generate` there is no browser
      // language, and a different fallback would bake a redirect into "/"
      fallbackLocale: 'uk',
    },
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#070908' },
        { name: 'generator', content: 'Nuxt' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;500;700;800&display=swap',
        },
      ],
    },
  },
})
