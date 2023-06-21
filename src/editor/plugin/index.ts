import { GetPlaceholderInfo, placeholdersPlugin } from './placeholders'
import { newHighlightStyle, Theme } from './theme'
import { customCompletions } from './customCompletions'
import { CompletionsType, FunctionCompletionsType, HintPathType, Hotkey, QuickMatchMap } from '../interface'
import { EditorView, highlightActiveLineGutter, lineNumbers, keymap } from '@codemirror/view'
import { keywordsPlugin } from './keywords'
import { Extension } from '@codemirror/state'
import { syntaxHighlighting, foldGutter, indentOnInput } from '@codemirror/language'
import { operatorKeyword } from './operatorKeyword'
import { panelsPlugin, searchPlugin } from './search'
import { searchKeymap } from '../components/search'
import { wordKeymap } from './keymap'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { Lint } from './lint'
import { lintGutter } from '../codermirror/lint'
// import { wordHoverTooltips } from './hoverTooltip'
export interface getExtensionsPluginProps {
  // getPlaceholderInfo: GetPlaceholderInfo
  completions: (CompletionsType | FunctionCompletionsType)[]
  hintPaths?: HintPathType[];
  keywordsColor?: string;
  keywordsClassName?: string;
  keywords?: string[];
  quickMatchMap: QuickMatchMap
  operatorKeywords: string[]
  searchContainer?: HTMLElement | null
  hotkey?: Hotkey
  editorRef: React.MutableRefObject<ReactCodeMirrorRef | null>
  deletedPlaceholders: string[]
}

export const getExtensionsPlugin = ({
  // getPlaceholderInfo,
  completions, hintPaths,keywords, keywordsColor, keywordsClassName, quickMatchMap, operatorKeywords, searchContainer, hotkey, editorRef, deletedPlaceholders
}: getExtensionsPluginProps): Extension[] => {
  return [
    keywords?.length ? keywordsPlugin(keywords, keywordsColor, keywordsClassName) : null,
    Theme,
    placeholdersPlugin(quickMatchMap, deletedPlaceholders),
    operatorKeyword(operatorKeywords),
    EditorView.lineWrapping,
    indentOnInput(),
    searchKeymap(hotkey),
    wordKeymap(editorRef as React.MutableRefObject<ReactCodeMirrorRef>, hotkey),
    // searchContainer ? panelsPlugin(searchContainer) : null,
    searchPlugin(),
    lintGutter(),
    Lint(deletedPlaceholders),
    customCompletions({completions, hintPaths, quickMatchMap}),
    syntaxHighlighting(newHighlightStyle),
    highlightActiveLineGutter(),
    lineNumbers(),
    // wordHoverTooltips
  ].filter(o => !!o) as  Extension[]
}
