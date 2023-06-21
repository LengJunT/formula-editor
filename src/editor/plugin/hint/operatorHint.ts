import { getBeforeWord, hintPipelineLogic, hintPipelineLogicProps, pipelineReturnParams } from './utils'
import {
  deduplicateAndFlatten,
  filterQuickMatchMapByReturnType,
  getLastFunctionName,
  removeFunctionParams
} from '../../../utils'
import { QuickMatchMap } from '../../interface'
import { coverSnippetCompletion } from '../../codermirror'

const rule = [
  ['number'],
  ['string']
]

const handleParams = (data: hintPipelineLogicProps, type: string, isPipe?: boolean) => {
  const { quickMatchMap, word } = data
  const types = deduplicateAndFlatten(rule.filter(item => item.includes(type)) ?? [])
  let _quickMatchMap = types.length ? filterQuickMatchMapByReturnType(quickMatchMap, types) : quickMatchMap
  // if (isPipe) {
  //   return pipelineReturnParams({
  //     ...data,
  //     quickMatchMap: _quickMatchMap,
  //     paramsType: type
  //   }, 'pipe')
  // }
  const options = types.length ? Object.values(_quickMatchMap) : []
  return pipelineReturnParams({
    from: word.to,
    to: word.to,
    filter: false,
    options: options?.map(item => {
      return coverSnippetCompletion(' ' + item.template, {
        label: item.label,
        detail: item.label,
        type: item.type,
        boost: item.boost,
      })
    }) ?? []
  }, 'end')
}

export const operatorHint: hintPipelineLogic = (props) => {
  const {
    latestChar, curLineText,  context,quickMatchMap
  } = props

   const word = getBeforeWord(context)
  if (!word) return null
  if (latestChar === '+') {
    const { text } = word
   console.log('operatorHint', word, curLineText)
    // 取倒数第二个
    const beforeText = text.split(' ').filter(t => !!t).slice(-2, -1)?.[0]
    const functionName = getLastFunctionName(removeFunctionParams(text))
    // 是个函数
    if (functionName) {
      const functionInfo = quickMatchMap[functionName]
      if (!functionInfo) return null
      const { returnType } = functionInfo
      return handleParams(props, returnType)
    }
    const match = /\${(.*?)}/g.exec(beforeText)
    // 是个标签
    if (match && match[1]) {
      const placeholders = match[1]
      const placeholderInfo = quickMatchMap[placeholders.split('.').pop() ?? '']
      return handleParams(props, placeholderInfo.returnType)
    }
  }
  return null

}
