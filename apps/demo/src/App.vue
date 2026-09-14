<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import en from '@storyblok/translations/en.json'
import { availableLocales, setLocale } from './i18n'

const { t, locale } = useI18n()

const selected = ref(locale.value)
const count = ref(1)

const source = en as Record<string, string>

// A literal such as {'{0}'} must not be mistaken for a placeholder, so the
// name has to start with a letter or underscore.
const placeholderPattern = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g

// vue-i18n fills `n` from the count, so it needs no input of its own.
const countPlaceholder = 'n'

type Row = {
  key: string
  source: string
  isPlural: boolean
  names: string[]
}

const rows = computed<Row[]>(() =>
  Object.keys(source)
    .sort()
    .map((key) => {
      const value = source[key]
      const names = [
        ...new Set(
          [...value.matchAll(placeholderPattern)].map((match) => match[1]),
        ),
      ].filter((name) => name !== countPlaceholder)
      return { key, source: value, isPlural: value.includes('|'), names }
    }),
)

const sampleValues = reactive<Record<string, string>>({
  entryName: 'Home page',
  name: 'Story',
})

function valuesFor(row: Row): Record<string, string> {
  return Object.fromEntries(
    row.names.map((name) => [name, sampleValues[name] ?? `<${name}>`]),
  )
}

function render(row: Row): string {
  if (row.isPlural) {
    return t(row.key, valuesFor(row), count.value)
  }
  return t(row.key, valuesFor(row))
}

async function onLocaleChange(next: string): Promise<void> {
  await setLocale(next)
  selected.value = next
}
</script>

<template>
  <main>
    <header>
      <h1>App localization demo</h1>
      <div class="controls">
        <label>
          Count
          <input v-model.number="count" type="number" min="0" />
        </label>
        <label>
          Language
          <select
            :value="selected"
            @change="onLocaleChange(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="code in availableLocales" :key="code" :value="code">
              {{ code }}
            </option>
          </select>
        </label>
      </div>
    </header>

    <p class="hint">
      {{ rows.length }} keys, read from
      <code>packages/translations/v2/en.json</code>. Every key renders, with no
      code change.
    </p>

    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Source</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.key">
          <td>
            <code>{{ row.key }}</code>
            <span v-if="row.isPlural" class="tag">plural</span>
            <span v-for="name in row.names" :key="name" class="value-input">
              <label>
                {{ name }}
                <input v-model="sampleValues[name]" type="text" />
              </label>
            </span>
          </td>
          <td class="preserve source">{{ row.source }}</td>
          <td class="preserve">{{ render(row) }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: #12212f;
  background: #f7f8fa;
}
main {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  margin: 0;
  font-size: 1.25rem;
}
.controls {
  display: flex;
  gap: 1.25rem;
}
label {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
}
select,
input {
  padding: 0.3rem 0.5rem;
  border: 1px solid #c3ccd6;
  border-radius: 4px;
  font: inherit;
}
input {
  width: 4.5rem;
}
.hint {
  margin: 0.5rem 0 1rem;
  color: #5a6b7b;
  font-size: 0.8125rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e1e6ec;
  border-radius: 8px;
  overflow: hidden;
}
th,
td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #eef1f4;
  text-align: left;
  vertical-align: top;
  font-size: 0.875rem;
}
th {
  background: #f2f4f7;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #5a6b7b;
}
td:first-child {
  width: 16rem;
}
td:nth-child(2) {
  width: 28rem;
}
code {
  font-size: 0.8125rem;
  overflow-wrap: anywhere;
}
.source {
  color: #5a6b7b;
}
.tag {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.05rem 0.35rem;
  background: #eaf3ff;
  border-radius: 999px;
  color: #1d63b3;
  font-size: 0.6875rem;
  font-weight: 600;
}
.preserve {
  white-space: pre-wrap;
}
.value-input {
  display: block;
  margin-top: 0.4rem;
}
.value-input label {
  font-size: 0.75rem;
  color: #5a6b7b;
}
.value-input input {
  width: 9rem;
  padding: 0.15rem 0.35rem;
  font-size: 0.8125rem;
}
</style>
