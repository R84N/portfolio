<script setup lang="ts">
import { initSmoothScroll } from '~/composables/useSmoothScroll'

const { c } = useContent()
const head = useLocaleHead() // <html lang>, hreflang alternates, og:locale

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: head.value.link,
  meta: head.value.meta,
}))
useSeoMeta({
  title: () => c.value.meta.title,
  description: () => c.value.meta.description,
  ogTitle: () => c.value.meta.title,
  ogDescription: () => c.value.meta.description,
})

onMounted(() => {
  initSmoothScroll()

  // A hello for fellow developers who open DevTools
  console.log(
    '%c<misha /> %c Привіт, колего / Hi, fellow dev 👋  Nuxt + Vue 3, smoke = WebGL fluid sim.',
    'background:#42b883;color:#04130b;font-weight:700;padding:4px 8px;border-radius:4px',
    'color:#42b883;font-weight:600',
  )
})
</script>

<template>
  <div>
    <Fireflies />
    <SmokeCanvas />
    <CursorFollower />

    <SiteNav />
    <NuxtPage />
    <SiteFooter class="page" />
  </div>
</template>
