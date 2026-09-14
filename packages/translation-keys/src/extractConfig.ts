import type { I18nextToolkitConfig } from 'i18next-cli'
import { i18nWorkspaceGlobs } from './i18nWorkspaceGlobs.ts'
import {
  localeDirectory,
  sourceLocale,
  translationLocales,
} from './translationLocales.ts'
import { vueSfcPlugin } from './vueSfcPlugin.ts'

export const createExtractConfig = (): I18nextToolkitConfig => ({
  locales: translationLocales(),
  extract: {
    input: i18nWorkspaceGlobs(),
    ignore: [
      '**/node_modules/**',
      '**/__tests__/**',
      '**/__eslint-tests__/**',
      '**/*.test.ts',
      '**/*.test-d.ts',
      '**/*.spec.ts',
    ],
    output: `${localeDirectory}/{{language}}.json`,
    mergeNamespaces: true,
    functions: ['t', '$t', '*.t', '*.$t'],
    // Keys are the actual English translation, so `.` and `:` are text, not structure - for now
    keySeparator: false,
    nsSeparator: false,
    disablePlurals: true,
    extractFromComments: false,
    defaultValue: (key: string, _namespace: string, locale: string): string =>
      locale === sourceLocale ? key : '',
    removeUnusedKeys: true,
    sort: 'locize',
  },
  plugins: [vueSfcPlugin()],
})
