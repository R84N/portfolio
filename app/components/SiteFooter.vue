<script setup lang="ts">
const { c } = useContent()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="wrap footer-inner">
      <span>© {{ year }} {{ c.name }}</span>
      <span class="built">
        {{ c.footer.built[0] }} <b>Nuxt</b> + <b>Vue 3</b> · {{ c.footer.built[1] }}
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--line); padding: 28px 0 34px; color: var(--muted); font-size: 14px; }
.footer-inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.built { font-family: var(--mono); font-size: 13px; }
.built b { color: var(--green); font-weight: 600; }
</style>
