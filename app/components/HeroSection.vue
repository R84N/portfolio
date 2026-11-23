<script setup lang="ts">
import gsap from 'gsap'
import { scrollToTarget } from '~/composables/useSmoothScroll'

const { c } = useContent()

const root = ref<HTMLElement | null>(null)

onMounted(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero-title .line > span', {
        yPercent: 110,
        duration: 1,
        stagger: 0.12,
        clearProps: 'transform',
        // lines clip only while sliding in; afterwards the green glow can spill out
        onComplete: () => root.value?.querySelector('.hero-title')?.classList.add('done'),
      }, '-=0.3')
      .from('.hero-intro, .hero-actions', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
      .from('.pillar', { x: -40, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.5')
      .from('.code', { y: 60, rotateX: 12, opacity: 0, duration: 1.1 }, '-=1.1')
      .from('.code-line', { opacity: 0, x: -10, duration: 0.35, stagger: 0.06 }, '-=0.5')
  }, root.value!)
  onBeforeUnmount(() => ctx.revert())
})
</script>

<template>
  <section id="top" ref="root" class="hero">
    <div class="wrap hero-grid">
      <div class="hero-text">
        <p class="eyebrow hero-eyebrow">// {{ c.hero.eyebrow }}</p>
        <h1 class="hero-title">
          <span class="line"><span>{{ c.name }}</span></span>
          <span class="line"><span v-html="c.hero.line2" /></span>
          <span class="line"><span><span v-html="c.hero.line3" /><i class="caret" /></span></span>
        </h1>
        <p class="hero-intro">{{ c.hero.intro }}</p>
        <div class="hero-actions">
          <a href="#projects" class="btn btn-primary" @click.prevent="scrollToTarget('#projects')">{{ c.hero.primary }}</a>
          <a href="#contact" class="btn btn-ghost" @click.prevent="scrollToTarget('#contact')">{{ c.hero.secondary }}</a>
        </div>
      </div>

      <div class="code card" data-cursor>
        <div class="code-bar">
          <i /><i /><i />
          <span>server/api/hire.post.ts</span>
        </div>
        <pre><code><span class="code-line"><b class="k">import</b> { <b class="f">defineEventHandler</b> } <b class="k">from</b> <b class="s">'h3'</b></span>
<span class="code-line"> </span>
<span class="code-line"><b class="k">export default</b> <b class="f">defineEventHandler</b>(<b class="k">async</b> (event) => {</span>
<span class="code-line">  <b class="k">const</b> task = <b class="k">await</b> <b class="f">readBody</b>(event)</span>
<span class="code-line"> </span>
<span class="code-line">  <b class="k">return</b> {</span>
<span class="code-line">    frontend: [<b class="s">'vue'</b>, <b class="s">'nuxt'</b>, <b class="s">'pinia'</b>],</span>
<span class="code-line">    backend:  [<b class="s">'node'</b>, <b class="s">'express'</b>, <b class="s">'prisma'</b>],</span>
<span class="code-line">    status:   <b class="s">'ready to ship'</b> <b class="c">// ✓</b></span>
<span class="code-line">  }</span>
<span class="code-line">})</span></code></pre>
      </div>
    </div>

    <div class="wrap pillars">
      <div v-for="p in c.pillars" :key="p.n" class="pillar" data-cursor>
        <span class="pillar-n">{{ p.n }}</span>
        <div>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  padding: 140px 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 70px;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 60px;
  align-items: center;
}
.hero-title {
  font-size: clamp(42px, 6.6vw, 92px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.045em;
  margin-top: 18px;
}
.hero-title .line { display: block; overflow: hidden; padding-bottom: 0.08em; }
.hero-title.done .line { overflow: visible; }
.hero-title .line > span { display: inline-block; }
.hero-title .line:first-child { font-size: 0.48em; letter-spacing: -0.02em; color: var(--muted); font-weight: 700; }
.hero-title :deep(em) {
  font-style: normal;
  color: var(--green);
  text-shadow: 0 0 40px rgba(66, 184, 131, 0.5);
}
.hero-title :deep(em.node) { color: var(--green-2); text-shadow: 0 0 40px rgba(104, 160, 99, 0.5); }
.caret {
  display: inline-block;
  width: 0.08em;
  height: 0.82em;
  margin-left: 0.08em;
  background: var(--green);
  vertical-align: -0.06em;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.hero-intro { color: var(--muted); font-size: 19px; max-width: 560px; margin-top: 26px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }

.code {
  perspective: 800px;
  overflow: hidden;
  box-shadow: 0 30px 80px -30px rgba(66, 184, 131, 0.35);
}
.code-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
}
.code-bar i { width: 11px; height: 11px; border-radius: 50%; background: #2a332e; }
.code-bar i:first-child { background: var(--green); }
.code-bar span { margin-left: 10px; }
pre {
  padding: 22px 22px 26px;
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.75;
  overflow-x: auto;
  color: #c9d6cf;
}
.code-line { display: inline-block; white-space: pre; }
pre { scrollbar-width: thin; scrollbar-color: rgba(66, 184, 131, 0.3) transparent; }
pre::-webkit-scrollbar { height: 5px; }
pre::-webkit-scrollbar-thumb { background: rgba(66, 184, 131, 0.3); border-radius: 5px; }
pre b { font-weight: 400; }
.k { color: #c792ea; }
.f { color: var(--green-3); }
.s { color: #e9c46a; }
.c { color: var(--green); }

.pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.pillar {
  display: flex;
  gap: 18px;
  padding: 22px 0 0;
  border-top: 1px solid var(--line);
  position: relative;
}
.pillar::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  height: 1px;
  width: 0;
  background: var(--green);
  box-shadow: 0 0 10px var(--green);
  transition: width 0.6s cubic-bezier(0.7, 0, 0.2, 1);
}
.pillar:hover::before { width: 100%; }
.pillar-n { font-family: var(--mono); color: var(--green); font-size: 14px; padding-top: 4px; }
.pillar h3 { font-size: 20px; letter-spacing: -0.01em; }
.pillar p { color: var(--muted); font-size: 15px; margin-top: 4px; }

@media (max-width: 980px) {
  .hero-grid { grid-template-columns: 1fr; gap: 44px; }
  .pillars { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .hero { padding-top: 110px; gap: 50px; }
  .hero-intro { font-size: 17px; }
  pre { font-size: 12px; padding: 16px; }
}
</style>
