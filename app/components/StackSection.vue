<script setup lang="ts">
const { c, shared } = useContent()
const stack = shared.stack
const all = Object.values(stack).flat()
</script>

<template>
  <section id="stack" class="section">
    <div class="wrap">
      <div data-reveal>
        <p class="eyebrow">{{ c.stack.eyebrow }}</p>
        <h2 class="title" v-html="c.stack.title" />
      </div>

      <div class="groups">
        <div v-for="(items, group) in stack" :key="group" class="group card" data-reveal data-cursor>
          <h3><span>{{ group === 'Frontend' ? '◆' : group === 'Backend' ? '⬢' : '▲' }}</span> {{ group }}</h3>
          <ul>
            <li v-for="t in items" :key="t" class="chip">{{ t }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="(t, i) in [...all, ...all]" :key="i">{{ t }}<i>✦</i></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 50px;
}
.group { padding: 28px; transition: border-color 0.3s, box-shadow 0.3s; }
.group:hover { border-color: rgba(66, 184, 131, 0.5); box-shadow: 0 20px 60px -30px rgba(66, 184, 131, 0.5); }
.group h3 { font-size: 20px; display: flex; align-items: center; gap: 10px; }
.group h3 span { color: var(--green); font-size: 16px; }
.group ul { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }

.marquee {
  margin-top: 90px;
  border-block: 1px solid var(--line);
  overflow: hidden;
  padding: 22px 0;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 50s linear infinite;
}
.marquee-track span {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(66, 184, 131, 0.55);
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.marquee-track span:nth-child(3n) { color: var(--green); -webkit-text-stroke: 0; }
.marquee-track i { font-style: normal; font-size: 0.4em; color: var(--green-2); margin: 0 0.9em; -webkit-text-stroke: 0; }
@keyframes marquee { to { transform: translateX(-50%); } }

@media (max-width: 900px) {
  .groups { grid-template-columns: 1fr; gap: 14px; margin-top: 32px; }
}
@media (max-width: 760px) {
  .group { padding: 22px; }
  .group ul { margin-top: 16px; gap: 7px; }
  .marquee { margin-top: 56px; padding: 16px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
</style>
