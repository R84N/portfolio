import { content, shared, type Locale } from '~/data/profile'

/** Page text for the current language (switches with the i18n locale). */
export function useContent() {
  const { locale } = useI18n()
  const c = computed(() => content[(locale.value as Locale)] ?? content.uk)
  return { c, shared }
}
