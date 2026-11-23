<script setup lang="ts">
const { c, shared } = useContent()
const email = shared.contacts.email

const copied = ref(false)
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    window.location.href = `mailto:${email}`
  }
}

const socials = [
  { label: 'Telegram', href: shared.contacts.telegram },
  { label: 'LinkedIn', href: shared.contacts.linkedin },
]
</script>

<template>
  <section id="contact" class="section contact">
    <div class="wrap">
      <div class="box card" data-reveal>
        <p class="eyebrow">{{ c.contact.eyebrow }}</p>
        <h2 class="big" v-html="c.contact.title" />
        <p class="lead">{{ c.contact.lead }}</p>

        <div class="actions">
          <a :href="`mailto:${email}`" class="btn btn-primary">{{ email }}</a>
          <button class="btn btn-ghost" @click="copyEmail">{{ copied ? c.contact.copied : c.contact.copy }}</button>
        </div>

        <ul class="socials">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener">{{ s.label }} <span>↗</span></a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.box {
  padding: clamp(32px, 6vw, 80px);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.box::before {
  content: '';
  position: absolute;
  inset: auto -20% -60% -20%;
  height: 120%;
  background: radial-gradient(closest-side, rgba(66, 184, 131, 0.22), transparent);
  pointer-events: none;
}
.big {
  font-size: clamp(40px, 7vw, 96px);
  line-height: 1;
  letter-spacing: -0.045em;
  font-weight: 800;
  margin-top: 18px;
  position: relative;
}
.big :deep(em) { font-style: normal; color: var(--green); text-shadow: 0 0 40px rgba(66, 184, 131, 0.45); }
.lead { margin-inline: auto; position: relative; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 36px; position: relative; }
.socials {
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 34px;
  margin-top: 40px;
  font-family: var(--mono);
  font-size: 15px;
  position: relative;
}
.socials a { color: var(--muted); transition: color 0.25s; }
@media (max-width: 520px) {
  .actions { flex-direction: column; gap: 10px; margin-top: 28px; }
  .actions .btn { width: 100%; }
  .socials { margin-top: 28px; }
}
.socials a span { display: inline-block; transition: transform 0.25s; color: var(--green); }
.socials a:hover { color: var(--text); }
.socials a:hover span { transform: translate(3px, -3px); }
</style>
