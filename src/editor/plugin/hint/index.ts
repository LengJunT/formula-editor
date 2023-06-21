import { CompletionsType, QuickMatchMap } from '../../interface'
import { placeholdersHint } from './placeholdersHint'
import { dataHint } from './dataHint'
import { functionHint } from './functionHint'
import { CompletionContext } from '@codemirror/autocomplete'
import { hintHoc, pipelineHint } from './utils'
import { operatorHint } from './operatorHint'

// const hint = hintHoc(props => {
//   return pipelineHint(props, functionHint, placeholdersHint, dataHint(completions))
// })

/**
 * 提示集合
 * @param {QuickMatchMap} quickMatchMap
 * @returns {[((context: CompletionContext) => (CompletionResult | Promise<CompletionResult | null> | null))]}
 */
export const hintGather = (quickMatchMap: QuickMatchMap, completions: CompletionsType[]) => {
   return [
     hintHoc(props => {
       return pipelineHint(props, operatorHint, functionHint, placeholdersHint, dataHint(completions))
     })
   ]

  // return [
  //   functionHint(),
  //   ...(quickMatchMap ? [
  //     placeholdersHint(quickMatchMap),
  //     // contextHint(quickMatchMap)
  //   ] : []),
  //   ...(completions ? [
  //     dataHint(completions)
  //   ] : []),
  // ]
}
