import { readdirSync } from 'node:fs'

export const localeDirectory = 'packages/translations/v2'

export const sourceLocale = 'en'

export const localeFile = (locale: string): string =>
  `${localeDirectory}/${locale}.json`

export const translationLocales = (): string[] => {
  const locales = readdirSync(localeDirectory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .filter((locale) => locale !== sourceLocale)
    .sort()

  return [sourceLocale, ...locales]
}
