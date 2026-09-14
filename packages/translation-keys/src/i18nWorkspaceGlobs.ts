import { readFileSync, readdirSync } from 'node:fs'
import type { Dirent } from 'node:fs'
import { join } from 'node:path'

const workspaceRoots = ['apps', 'packages']
const skipped = new Set(['node_modules', 'dist', '.turbo'])

const declaresVueI18n = (manifestPath: string): boolean => {
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (typeof manifest !== 'object' || manifest === null) {
    return false
  }
  const { dependencies, devDependencies, peerDependencies } = manifest as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
  }
  return (
    'vue-i18n' in { ...dependencies, ...devDependencies, ...peerDependencies }
  )
}

const collect = (directory: string, found: string[]): void => {
  let entries: Dirent[]
  try {
    entries = readdirSync(directory, { withFileTypes: true })
  } catch {
    return
  }

  if (entries.some((entry) => entry.name === 'package.json')) {
    if (declaresVueI18n(join(directory, 'package.json'))) {
      found.push(directory)
    }
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !skipped.has(entry.name)) {
      collect(join(directory, entry.name), found)
    }
  }
}

export const i18nWorkspaceGlobs = (): string[] => {
  const found: string[] = []
  for (const root of workspaceRoots) {
    collect(root, found)
  }
  return found.sort().map((directory) => `${directory}/src/**/*.{ts,vue}`)
}
