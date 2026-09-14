# @repo/translation-keys

Keeps the translation files in sync with the code.

A translation key in Storyfront is the English sentence itself, as in
`t('Save changes')`. So a new label is a new key, and a deleted label leaves a
key behind. This package reads the source code and rewrites every file in
`packages/translations/v2` to match.

## Use

```bash
pnpm translations:sync
```

Run it from the repository root, after you add or remove a label. It rewrites
every locale file and prints each file it wrote.

- A new key gets the English sentence as its value in `en.json`, and an empty
  value in every other locale file. vue-i18n falls back to English on an empty
  value, so the label works in every language right away.
- A key the code no longer uses is removed from every locale file.

The scan paths and the locale list come from the repository, not from
arguments.

## Runtime

Node only (scripts and tools. No browser API).

- TypeScript config: `@repo/typescript-config/node.json`
- Type check: `tsc -b --noEmit`
- Test environment: `node`

These three values belong together. If you change one, change all three.

## Checks

CI runs these three scripts for each package. A script that the package does
not define does not run, and CI stays green. Keep all three.

```bash
pnpm turbo run lint check:types test --filter=@repo/translation-keys
```

## Rules

`src/main.ts` is the only entry point, and it is a command, not a library. The
rules for exports, state and dependencies are in the
[package playbook](https://app.notion.com/p/storyblok/Playbook-3b184ab4f0f381fa9f00d5ace91a93e0).
