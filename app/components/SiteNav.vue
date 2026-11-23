<script setup lang="ts">
import { scrollToTarget } from '~/composables/useSmoothScroll'

const { c, shared } = useContent()
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const links = computed(() => [
  { href: '#about', label: c.value.nav.about },
  { href: '#stack', label: c.value.nav.stack },
  { href: '#projects', label: c.value.nav.projects },
  { href: '#process', label: c.value.nav.process },
  { href: '#contact', label: c.value.nav.contact },
])

const open = ref(false)
const scrolled = ref(false)

function go(href: string) {
  open.value = false
  scrollToTarget(href)
}

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 30 }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header class="nav" :class="{ scrolled, open }">
    <div class="wrap nav-inner">
      <a href="#top" class="logo" @click.prevent="go('#top')">
        <span class="bracket">&lt;</span>{{ shared.short }}<span class="bracket"> /&gt;</span>
      </a>

      <nav class="links" :aria-label="c.nav.menu">
        <a v-for="l in links" :key="l.href" :href="l.href" @click.prevent="go(l.href)">{{ l.label }}</a>
      </nav>

      <a href="#contact" class="btn btn-primary cta" @click.prevent="go('#contact')">{{ c.nav.cta }}</a>

      <div class="lang" role="group" aria-label="Language">
        <NuxtLink
          v-for="l in locales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
          :class="{ active: l.code === locale }"
          :hreflang="l.language"
          @click="open = false"
        >{{ l.name }}</NuxtLink>
      </div>

      <button class="burger" :aria-expanded="open" :aria-label="c.nav.menu" @click="open = !open">
        <span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s;
  border-bottom: 1px solid transparent;
}
.nav.scrolled,
.nav.open {
  background: rgba(7, 9, 8, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-color: var(--line);
}
.nav-inner {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.logo {
  font-family: var(--mono);
  font-weight: 600;
  font-size: 18px;
  color: var(--text);
}
.bracket { color: var(--green); }
.links {
  display: flex;
  gap: 28px;
  margin-left: auto;
  font-size: 15px;
  color: var(--muted);
}
.links a { position: relative; transition: color 0.25s; }
.links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 1px;
  background: var(--green);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s;
}
.links a:hover { color: var(--text); }
.links a:hover::after { transform: scaleX(1); transform-origin: left; }
.cta { padding: 10px 20px; }

.lang {
  display: flex;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
}
.lang a {
  padding: 5px 10px;
  border-radius: 999px;
  color: var(--muted);
  transition: color 0.25s, background 0.25s;
}
.lang a:hover { color: var(--text); }
.lang a.active { background: rgba(66, 184, 131, 0.16); color: var(--green); }

.burger { display: none; width: 40px; height: 40px; position: relative; }
.burger span {
  position: absolute;
  left: 9px;
  right: 9px;
  height: 2px;
  background: var(--text);
  transition: transform 0.3s, top 0.3s;
}
.burger span:first-child { top: 15px; }
.burger span:last-child { top: 23px; }
.open .burger span:first-child { top: 19px; transform: rotate(45deg); }
.open .burger span:last-child { top: 19px; transform: rotate(-45deg); }

@media (max-width: 860px) {
  .cta { display: none; }
  .lang { margin-left: auto; }
  .burger { display: block; }
  .links {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 8px 16px 20px;
    background: rgba(7, 9, 8, 0.92);
    border-bottom: 1px solid var(--line);
    font-size: 20px;
    color: var(--text);
    clip-path: inset(0 0 100% 0);
    transition: clip-path 0.45s cubic-bezier(0.7, 0, 0.2, 1);
  }
  .links a { padding: 12px 0; }
  .links a::after { display: none; }
  .open .links { clip-path: inset(0 0 0 0); }
}
</style>
