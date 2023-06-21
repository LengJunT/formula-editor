import { addDeduplicateKey, deduplicationHintOptions, hintHoc, hintPipelineLogic, pipelineReturnParams } from './utils'
import { BootsMap, CompletionsType, CompletionsTypeEnum } from '../../interface'
import { completeFromList, snippetCompletion } from '@codemirror/autocomplete'
import { coverSnippetCompletion } from '../../codermirror'
import { mergeAndDeduplicate } from '../../../utils'

/**
 * 普通的不变数据的提示
 * @param {CompletionsType[]} completions
 * @returns {CompletionSource}
 */
export const dataHint = (completions: CompletionsType[]): hintPipelineLogic => {
  return ({
    word,
    contextPlaceholdersList
  }) => {
    // 上下文存在的标签数据优先
    const options = deduplicationHintOptions(mergeAndDeduplicate<CompletionsType>(contextPlaceholdersList, completions))
    // dataHint 需要还最后执行，所以不需要将这个的数据放进去重数组里
    // addDeduplicateKey(options.map((item: any) => (item.value ?? item.label ?? '')))
    return pipelineReturnParams({
      from: word.from,
      options: options?.map((item) => {
        const opt = {
          label: item.label,
          detail: item.detail,
          type: item.type,
          boost: item.boost ?? BootsMap[item.type]
        }
        if (!item.template) {
          return opt
        }
        return coverSnippetCompletion(item.template, opt)
      }) || [],
    }, 'end')
  }
}
