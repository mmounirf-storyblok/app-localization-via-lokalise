<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLocales, setLocale } from './i18n'

const { t, locale } = useI18n()

const selected = ref(locale.value)
const daysLeft = ref(1)
const replyCount = ref(3)

async function onLocaleChange(next: string): Promise<void> {
  await setLocale(next)
  selected.value = next
}
</script>

<template>
  <main>
    <header>
      <h1>App localization demo</h1>
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
    </header>

    <table>
      <thead>
        <tr>
          <th>Case</th>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Plain text</td>
          <td><code>This action cannot be undone.</code></td>
          <td>{{ t('This action cannot be undone.') }}</td>
        </tr>
        <tr>
          <td>Named placeholder</td>
          <td><code>"{entryName}" updated successfully!</code></td>
          <td>
            {{
              t('"{entryName}" updated successfully!', {
                entryName: 'Home page',
              })
            }}
          </td>
        </tr>
        <tr>
          <td>
            Plural, two parts
            <input v-model.number="replyCount" type="number" min="0" />
          </td>
          <td><code>+{n} more reply | +{n} more replies</code></td>
          <td>{{ t('+{n} more reply | +{n} more replies', replyCount) }}</td>
        </tr>
        <tr>
          <td>
            Plural, three parts
            <input v-model.number="daysLeft" type="number" min="0" />
          </td>
          <td><code>0 days left | 1 day left | {n} days left</code></td>
          <td>{{ t('0 days left | 1 day left | {n} days left', daysLeft) }}</td>
        </tr>
        <tr>
          <td>Literal at sign</td>
          <td><code>Comment or add others with {'@'}</code></td>
          <td>{{ t(`Comment or add others with {'@'}`) }}</td>
        </tr>
        <tr>
          <td>Literal index placeholder</td>
          <td><code>With {'{0}'} the path will be replaced ...</code></td>
          <td>
            {{
              t(
                `With {'{0}'} the path will be replaced dynamically using parts of the current slug. Examples: {'{0}'}/categories/, {'{0}'}/{'{1}'}/categories/`,
              )
            }}
          </td>
        </tr>
        <tr>
          <td>Apostrophe before a placeholder</td>
          <td><code>Delete '{name}'?</code></td>
          <td>{{ t(`Delete '{name}'?`, { name: 'Marketing' }) }}</td>
        </tr>
        <tr>
          <td>Newline</td>
          <td><code>Environments allow you to safely work ...</code></td>
          <td class="preserve">
            {{
              t(
                'Environments allow you to safely work on isolated instances of your project.\n          They help you make changes to your schema and test new content structures without breaking your production systems',
              )
            }}
          </td>
        </tr>
        <tr>
          <td>Markup</td>
          <td><code>You don't have access ... &lt;br/&gt; ...</code></td>
          <!-- v-html is required because the source string carries a <br/> tag. -->
          <td
            v-html="
              t(
                `You don't have access to the organization settings. <br/> Please contact the organization owner or admin.`,
              )
            "
          />
        </tr>
        <tr>
          <td>Percent sign</td>
          <td><code>97% Uptime SLA</code></td>
          <td>{{ t('97% Uptime SLA') }}</td>
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
  max-width: 68rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
h1 {
  margin: 0;
  font-size: 1.25rem;
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
  margin-top: 0.35rem;
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
  width: 14rem;
  font-weight: 600;
}
td:nth-child(2) {
  width: 26rem;
}
code {
  color: #5a6b7b;
  font-size: 0.8125rem;
  overflow-wrap: anywhere;
}
.preserve {
  white-space: pre-wrap;
}
</style>
