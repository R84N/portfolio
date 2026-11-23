<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let triggers: ScrollTrigger[] = []

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  await nextTick()

  // Fade-up for everything marked with data-reveal.
  // CSS hides the element until it gets .is-revealed; GSAP animates from the
  // same hidden state, then the class takes over and GSAP's inline styles go.
  triggers = ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => {
      gsap.fromTo(els, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
        onComplete() {
          els.forEach(el => el.classList.add('is-revealed'))
          gsap.set(els, { clearProps: 'opacity,transform' })
        },
      })
    },
  })

  // Trigger positions depend on layout; recalc once web fonts have loaded
  ScrollTrigger.refresh()
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => triggers.forEach(t => t.kill()))
</script>

<template>
  <main class="page">
    <HeroSection />
    <AboutSection />
    <StackSection />
    <ProjectsSection />
    <ProcessSection />
    <ContactSection />
  </main>
</template>
