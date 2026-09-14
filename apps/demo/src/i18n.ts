import { createI18n } from 'vue-i18n'
import en from '@storyblok/translations/en.json'

const defaultLocale = 'en'

const localeLoaders = import.meta.glob<{ default: Record<string, string> }>(
  '../../../packages/translations/v2/*.json',
)

function localeFromPath(path: string): string {
  return path.split('/').pop()!.replace('.json', '')
}

export const availableLocales = Object.keys(localeLoaders)
  .map(localeFromPath)
  .sort()

// same runtime as storyfront
export const i18n = createI18n({
  mode: 'composition',
  allowComposition: true,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  formatFallbackMessages: true,
  silentTranslationWarn: true,
  silentFallbackWarn: false,
  globalInjection: false,
  warnHtmlInMessage: 'off',
  messages: { en } as Record<string, Record<string, string>>,
})

const loaded = new Set<string>([defaultLocale])

export async function setLocale(locale: string): Promise<void> {
  if (!loaded.has(locale)) {
    const entry = Object.entries(localeLoaders).find(
      ([path]) => localeFromPath(path) === locale,
    )
    if (!entry) return
    const messages = (await entry[1]()).default
    const withoutEmpty = Object.fromEntries(
      Object.entries(messages).filter(([, value]) => value !== ''),
    )
    i18n.global.setLocaleMessage(locale, withoutEmpty)
    loaded.add(locale)
  }
  document.documentElement.setAttribute('lang', locale)
  // `mode: 'composition'` alone leaves the Legacy API active, so `locale`
  // is a plain string here, exactly as in storyfront's translate.ts.
  i18n.global.locale = locale
}
