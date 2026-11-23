<script setup lang="ts">
/**
 * Floating fireflies from the old project's animated-background.css.
 * The old file had 30 hand-written @keyframes; here each firefly gets a
 * random path generated on mount and played with the Web Animations API.
 */
const COUNT = 30
const rand = (min: number, max: number) => Math.random() * (max - min) + min

const flies = Array.from({ length: COUNT }, () => ({
  drift: `${Math.round(rand(9, 17))}s`,
  flash: `${Math.round(rand(5000, 11000))}ms`,
  delay: `${Math.round(rand(500, 9000))}ms`,
}))

const root = ref<HTMLElement | null>(null)
const animations: Animation[] = []

onMounted(async () => {
  await nextTick()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  root.value?.querySelectorAll<HTMLElement>('.firefly').forEach((el) => {
    const steps = Math.round(rand(16, 28))
    const frames: Keyframe[] = Array.from({ length: steps }, () => ({
      transform: `translateX(${rand(-50, 50).toFixed(1)}vw) translateY(${rand(-50, 50).toFixed(1)}vh) scale(${rand(0.25, 1).toFixed(2)})`,
      easing: 'ease',
    }))
    animations.push(
      el.animate(frames, { duration: 200_000, direction: 'alternate', iterations: Infinity }),
    )
  })
})

onBeforeUnmount(() => animations.forEach(a => a.cancel()))
</script>

<template>
  <div ref="root" class="fireflies" aria-hidden="true">
    <div
      v-for="(f, i) in flies"
      :key="i"
      class="firefly"
      :style="{ '--drift': f.drift, '--flash': f.flash, '--delay': f.delay }"
    />
  </div>
</template>

<style scoped>
.fireflies {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.firefly {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.4vw;
  height: 0.4vw;
  min-width: 4px;
  min-height: 4px;
  margin: -0.2vw 0 0 9.8vw;
}

.firefly::before,
.firefly::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform-origin: -10vw;
}

.firefly::before {
  background: #021a10;
  opacity: 0.4;
  animation: drift var(--drift) ease alternate infinite;
}

.firefly::after {
  background: var(--green);
  opacity: 0;
  box-shadow: 0 0 0 0 var(--green);
  animation:
    drift var(--drift) ease alternate infinite,
    flash var(--flash) ease var(--delay) infinite;
}

@keyframes drift {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes flash {
  0%, 30%, 100% {
    opacity: 0;
    box-shadow: 0 0 0 0 var(--green);
  }
  5% {
    opacity: 1;
    box-shadow: 0 0 2vw 0.4vw var(--green);
  }
}

@media (max-width: 760px) {
  .firefly:nth-child(n + 13) { display: none; }
}
</style>
