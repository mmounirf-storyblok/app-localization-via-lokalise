import { NodeTypes, parse as parseTemplate } from '@vue/compiler-dom'
import type {
  RootNode,
  SimpleExpressionNode,
  TemplateChildNode,
} from '@vue/compiler-dom'
import { compileTemplate, parse } from '@vue/compiler-sfc'
import type { Plugin } from 'i18next-cli'
import ts from 'typescript'

const i18nTags = new Set(['i18n-t', 'I18nT', 'i18n', 'Translation'])
const keyProps = new Set(['keypath', 'path'])

const collectComponentKeys = (
  node: RootNode | SimpleExpressionNode | TemplateChildNode,
  keys: string[],
): void => {
  if (node.type === NodeTypes.ELEMENT && i18nTags.has(node.tag)) {
    for (const prop of node.props) {
      if (
        prop.type === NodeTypes.ATTRIBUTE &&
        keyProps.has(prop.name) &&
        prop.value !== undefined
      ) {
        keys.push(prop.value.content)
      }
    }
  }

  if ('children' in node) {
    for (const child of node.children) {
      if (typeof child !== 'string' && typeof child !== 'symbol') {
        collectComponentKeys(child, keys)
      }
    }
  }
}

// i18next-cli parses plugin output as TSX, and TSX reads `<V>(` in a generic
// arrow function as a JSX tag.
const stripTypes = (code: string): string =>
  ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      isolatedModules: true,
      verbatimModuleSyntax: false,
    },
  }).outputText

export const vueSfcPlugin = (): Plugin => ({
  name: 'vue-sfc',
  onLoad(code: string, path: string) {
    if (!path.endsWith('.vue')) {
      return undefined
    }

    const { descriptor, errors } = parse(code, { filename: path })
    const [firstError] = errors

    if (firstError) {
      throw new Error(`${path}: ${firstError.message}`)
    }

    const parts: string[] = []
    if (descriptor.script) {
      parts.push(descriptor.script.content)
    }
    if (descriptor.scriptSetup) {
      parts.push(descriptor.scriptSetup.content)
    }

    if (descriptor.template) {
      // from vue template to javascript - extract the direct calls of t()
      const compiled = compileTemplate({
        id: path,
        filename: path,
        source: descriptor.template.content,
        compilerOptions: {
          mode: 'module',
          prefixIdentifiers: true,
          comments: false,
        },
      })
      const [templateError] = compiled.errors
      if (templateError !== undefined) {
        throw new Error(`${path}: ${String(templateError)}`)
      }
      parts.push(compiled.code)

      // <i18n-t keypath=""> is an attribute, not a call, so the conversion above drops it
      const keys: string[] = []
      collectComponentKeys(parseTemplate(descriptor.template.content), keys)
      for (const key of keys) {
        parts.push(`t(${JSON.stringify(key)})`)
      }
    }

    return stripTypes(parts.join('\n;\n'))
  },
})
