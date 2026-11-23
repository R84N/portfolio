<script setup lang="ts">
const { c, shared } = useContent()

// shared data (title, link, tech) + the current language's text for each project
const projects = computed(() =>
  shared.projects.map((p, i) => ({ ...p, ...c.value.projects.items[i]! })),
)

// 3D tilt from the old cardsEffect.js, plus a glow that follows the cursor
function tilt(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  const r = card.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  card.style.setProperty('--rx', `${(-(y - r.height / 2) / 30).toFixed(2)}deg`)
  card.style.setProperty('--ry', `${((x - r.width / 2) / 30).toFixed(2)}deg`)
  card.style.setProperty('--mx', `${x}px`)
  card.style.setProperty('--my', `${y}px`)
}
function reset(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  card.style.setProperty('--rx', '0deg')
  card.style.setProperty('--ry', '0deg')
}
</script>

<template>
  <section id="projects" class="section">
    <div class="wrap">
      <div data-reveal>
        <p class="eyebrow">{{ c.projects.eyebrow }}</p>
        <h2 class="title" v-html="c.projects.title" />
        <p class="lead">{{ c.projects.lead }}</p>
      </div>

      <div class="grid">
        <!-- reveal on the wrapper, tilt on the card: two transforms never fight -->
        <div v-for="(p, i) in projects" :key="p.title" class="project-wrap" data-reveal>
        <article
          class="project card"
          data-cursor
          @mousemove="tilt"
          @mouseleave="reset"
        >
          <div class="project-head">
            <span class="num">0{{ i + 1 }}</span>
            <span class="tag">
              <b v-if="p.bonus" class="bonus">{{ c.projects.bonus }}</b>
              {{ p.tag }}
            </span>
          </div>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
          <ul>
            <li v-for="s in p.tech" :key="s" class="chip chip-tech">{{ s }}</li>
            <li v-for="s in p.features" :key="s" class="chip">{{ s }}</li>
          </ul>
          <a v-if="p.link" :href="p.link" target="_blank" rel="noopener" class="more">
            {{ p.link.replace(/^https?:\/\//, '').replace(/\/$/, '') }} <span>↗</span>
          </a>
        </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 50px;
}
.project-wrap { perspective: 1000px; display: flex; }
.project {
  width: 100%;
  --rx: 0deg;
  --ry: 0deg;
  --mx: 50%;
  --my: 50%;
  position: relative;
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.25s ease-out, border-color 0.3s;
}
.project::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(380px circle at var(--mx) var(--my), rgba(66, 184, 131, 0.16), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.project:hover { border-color: rgba(66, 184, 131, 0.55); }
.project:hover::before { opacity: 1; }
.project-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.num { font-family: var(--mono); color: var(--green); font-size: 14px; }
.tag { font-size: 13px; color: var(--muted); text-align: right; }
.project h3 { font-size: 26px; letter-spacing: -0.02em; margin-top: 46px; }
.project p { color: var(--muted); font-size: 15.5px; margin-top: 10px; flex: 1; }
.project ul { list-style: none; display: flex; flex-wrap: wrap; gap: 7px; margin-top: 24px; }
.chip-tech { background: rgba(66, 184, 131, 0.18); border-color: rgba(66, 184, 131, 0.55); font-weight: 600; }
.more {
  margin-top: 22px;
  color: var(--green);
  font-family: var(--mono);
  font-weight: 600;
  font-size: 15px;
  position: relative;
  z-index: 1;
  align-self: flex-start;
}
.more span { display: inline-block; transition: transform 0.25s; }
.more:hover span { transform: translate(3px, -3px); }
.bonus {
  font-family: var(--mono);
  font-weight: 600;
  font-size: 11px;
  color: #e9c46a;
  border: 1px solid rgba(233, 196, 106, 0.35);
  border-radius: 999px;
  padding: 2px 8px;
  margin-right: 6px;
  white-space: nowrap;
}

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr; }
  .project h3 { margin-top: 26px; }
}
</style>
