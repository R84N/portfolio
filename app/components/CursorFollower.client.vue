<script setup lang="ts">
import gsap from 'gsap'

const ring = ref<HTMLElement | null>(null)
const visible = ref(false)
const HOVER = 'a, button, [data-cursor]'

let cleanup: (() => void) | undefined

onMounted(async () => {
  await nextTick()
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !ring.value) return
  const el = ring.value
  gsap.set(el, { xPercent: -50, yPercent: -50 })
  const toX = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' })
  const toY = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' })

  const move = (e: MouseEvent) => {
    if (!visible.value) {
      gsap.set(el, { x: e.clientX, y: e.clientY })
      visible.value = true
    }
    toX(e.clientX)
    toY(e.clientY)
  }
  const over = (e: MouseEvent) => {
    if ((e.target as Element).closest?.(HOVER)) gsap.to(el, { scale: 1.8, duration: 0.4, ease: 'power2.out' })
  }
  const out = (e: MouseEvent) => {
    const to = e.relatedTarget as Element | null
    if ((e.target as Element).closest?.(HOVER) && !to?.closest?.(HOVER)) gsap.to(el, { scale: 1, duration: 0.4, ease: 'power2.out' })
  }
  const leave = () => { visible.value = false }

  window.addEventListener('mousemove', move, { passive: true })
  document.addEventListener('mouseover', over)
  document.addEventListener('mouseout', out)
  document.documentElement.addEventListener('mouseleave', leave)
  cleanup = () => {
    window.removeEventListener('mousemove', move)
    document.removeEventListener('mouseover', over)
    document.removeEventListener('mouseout', out)
    document.documentElement.removeEventListener('mouseleave', leave)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="ring" class="follower" :class="{ visible }" aria-hidden="true" />
</template>

<style scoped>
.follower {
  position: fixed;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border: 1px solid var(--green);
  border-radius: 50%;
  box-shadow: 0 0 13px var(--green), inset 0 0 8px rgba(66, 184, 131, 0.35);
  pointer-events: none;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s;
}
.follower.visible { opacity: 1; }
</style>
