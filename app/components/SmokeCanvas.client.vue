<script setup lang="ts">
import { startFluid } from '~/composables/useFluid'

const canvas = ref<HTMLCanvasElement | null>(null)
let stop: (() => void) | undefined

onMounted(async () => {
  // .client components render after mount — wait for the template
  await nextTick()
  if (!canvas.value) return
  try {
    stop = startFluid(canvas.value)
  } catch (err) {
    console.warn('[smoke] WebGL is not available:', err)
  }
})

onBeforeUnmount(() => stop?.())
</script>

<template>
  <canvas ref="canvas" class="smoke" aria-hidden="true" />
</template>

<style scoped>
.smoke {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.85;
  mix-blend-mode: screen;
}
</style>
