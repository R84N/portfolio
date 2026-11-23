<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { c } = useContent()

const root = ref<HTMLElement | null>(null)

// The glowing "road" from the old concept section: a line that draws itself
// while you scroll, lighting up each step's dot as it passes.
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  const ctx = gsap.context(() => {
    gsap.fromTo('.road-fill', { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 65%', end: 'bottom 60%', scrub: 1 },
    })
    gsap.utils.toArray<HTMLElement>('.step').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        onEnter: () => step.classList.add('lit'),
        onLeaveBack: () => step.classList.remove('lit'),
      })
      gsap.from(step.querySelector('.step-body'), {
        x: step.classList.contains('right') ? 60 : -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 80%' },
      })
    })
  }, root.value!)
  onBeforeUnmount(() => ctx.revert())
})
</script>

<template>
  <section id="process" ref="root" class="section">
    <div class="wrap">
      <div class="head" data-reveal>
        <p class="eyebrow">{{ c.process.eyebrow }}</p>
        <h2 class="title" v-html="c.process.title" />
      </div>

      <div class="steps">
        <div class="road"><div class="road-fill" /></div>
        <div
          v-for="(s, i) in c.process.steps"
          :key="s.n"
          class="step"
          :class="i % 2 ? 'right' : 'left'"
        >
          <span class="dot" />
          <div class="step-body card" data-cursor>
            <span class="step-n">{{ s.n }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head { text-align: center; }
.steps { position: relative; margin-top: 70px; }
.road {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: var(--line);
}
.road-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(var(--green-3), var(--green), var(--green-2));
  box-shadow: 0 0 14px var(--green);
  transform-origin: top;
}
.step {
  position: relative;
  display: flex;
  width: 50%;
  padding: 0 56px 60px;
}
.step:last-child { padding-bottom: 0; }
.step + .step { margin-top: -70px; }
.step.left { justify-content: flex-end; }
.step.right { margin-left: 50%; }
.dot {
  position: absolute;
  top: 30px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--line);
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
  z-index: 1;
}
.left .dot { right: -9px; }
.right .dot { left: -9px; }
.step.lit .dot {
  background: var(--green);
  border-color: var(--green-3);
  box-shadow: 0 0 0 6px rgba(66, 184, 131, 0.15), 0 0 24px var(--green);
}
.step-body { padding: 26px 28px; max-width: 440px; width: 100%; }
.step-n { font-family: var(--mono); color: var(--green); font-size: 13px; }
.step-body h3 { font-size: 22px; letter-spacing: -0.02em; margin-top: 6px; }
.step-body p { color: var(--muted); font-size: 15.5px; margin-top: 6px; }

@media (max-width: 800px) {
  .road { left: 9px; }
  .step,
  .step.right { width: 100%; margin-left: 0; padding: 0 0 36px 44px; justify-content: flex-start; }
  .step + .step { margin-top: 0; }
  .left .dot,
  .right .dot { left: 0; right: auto; }
  .head { text-align: left; }
}
</style>
