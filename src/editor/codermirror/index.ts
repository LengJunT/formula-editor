import {
  snippetCompletion,
  snippet
} from './snippet'
import { Completion } from '@codemirror/autocomplete'
const coverSnippetCompletion = (template: string, completion: Completion) => {
  return snippetCompletion(template, completion, '@')
}

const coverSnippet = (template: string) => {
  return snippet(template, '@')
}
export {
  coverSnippetCompletion,
  coverSnippet
}
