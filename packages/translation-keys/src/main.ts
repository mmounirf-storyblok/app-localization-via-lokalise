#!/usr/bin/env node
import { runExtractor } from 'i18next-cli'
import { existsSync } from 'node:fs'
import process from 'node:process'
import { createExtractConfig } from './extractConfig.ts'
import { localeDirectory } from './translationLocales.ts'

if (!existsSync(localeDirectory)) {
  console.error(
    `No ${localeDirectory} here. Run this from the repository root, or through \`pnpm translations:sync\`.`,
  )
  process.exit(1)
}

const { hasErrors } = await runExtractor(createExtractConfig(), {
  syncPrimaryWithDefaults: true,
  trustDerivedDefaults: true,
})

if (hasErrors) {
  process.exit(1)
}
