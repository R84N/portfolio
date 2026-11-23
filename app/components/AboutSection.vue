<script setup lang="ts">
const { c } = useContent()
</script>

<template>
  <section id="about" class="section">
    <div class="wrap about">
      <div data-reveal>
        <p class="eyebrow">{{ c.about.eyebrow }}</p>
        <h2 class="title" v-html="c.about.title" />
      </div>
      <div class="about-body">
        <p v-for="(p, i) in c.about.text" :key="i" data-reveal>{{ p }}</p>
        <dl class="facts" data-reveal>
          <div v-for="f in c.about.facts" :key="f.v" class="fact card" data-cursor>
            <dt>{{ f.k }}</dt>
            <dd>{{ f.v }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: start;
}
.about-body p { color: var(--muted); font-size: 19px; }
.about-body p + p { margin-top: 18px; }
.facts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 36px;
}
.fact { padding: 18px 20px; transition: border-color 0.3s, transform 0.3s; }
.fact:hover { border-color: var(--green); transform: translateY(-3px); }
.fact dt { font-family: var(--mono); font-size: 12px; color: var(--green); text-transform: uppercase; letter-spacing: 0.08em; }
.fact dd { font-weight: 700; margin-top: 4px; }

@media (max-width: 900px) {
  .about { grid-template-columns: 1fr; gap: 24px; }
  .about-body p { font-size: 17px; }
}
@media (max-width: 760px) {
  .facts { gap: 10px; margin-top: 28px; }
  .fact { padding: 14px 16px; }
  .fact dd { font-size: 15px; line-height: 1.35; }
}
@media (max-width: 340px) {
  .facts { grid-template-columns: 1fr; }
}
</style>
