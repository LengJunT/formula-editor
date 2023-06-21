
import { addDeduplicateKey, deduplicationHintOptions, hintHoc, hintPipelineLogic, pipelineReturnParams } from './utils'
import { useEditorStore } from '../../store'
import {
  curInputFunParamIndex,
  extractLastIncompleteFunction,
  extractLastIncompleteFunctionFirstParam,
  extractLastPlaceholder
} from '../../../utils'
import { coverSnippetCompletion } from '../../codermirror'
import { CompletionsTypeEnum, HintBoots } from '../../interface'

// 函数提示
export const functionHint: hintPipelineLogic  = ({
   quickMatchMap, context, paramsType
}) => {
  console.log('hint hint', 'functionHint', new Date().getTime())
  const word = context.matchBefore(/.*/g)
  if (!word) return null
    const text = word.text
    // 标签交给标签插件处理， 表对象除外
    if (text.endsWith('}.')) {
      const latestVarPath = extractLastPlaceholder(text)
      if (!latestVarPath) return null
      const info: any = quickMatchMap[latestVarPath ?? '']
      if (info?.type === CompletionsTypeEnum.TABLE_OBJECT) {
        // 找出表函数
        const funtions: any = Object.values(quickMatchMap).filter(item => item.paramsType?.types?.includes('table'))
        return pipelineReturnParams({
          from: word.to - latestVarPath.length - 4,
          to: word.to,
          filter: false,
          options: funtions?.map((item: any) => {
            console.log('替换',latestVarPath,  item.template, item.template.replace(/\@{(.*?)}/, `$\{${latestVarPath}}`))
            return coverSnippetCompletion(item.template.replace(/\@{(.*?)}/, `$\{${latestVarPath}}`), {
              label: item.label,
              detail: item.label,
              type: item.type,
              boost: item.boost,
            })
          }) ?? []
        }, 'end')
      }
      return null
    }
    if (paramsType) {
      let options = Object.values(quickMatchMap).filter(item => item.returnType === paramsType)
      const firstParam = extractLastIncompleteFunctionFirstParam(text)
      if (firstParam) {
        const latestVarPath = extractLastPlaceholder(firstParam)
        if (!latestVarPath) return null
        const _quickMatchMap= useEditorStore.getState().quickMatchMap
        const info: any = _quickMatchMap[latestVarPath ?? '']
        if (info?.type === CompletionsTypeEnum.TABLE_OBJECT) {
          options = info.children?.filter((item: any) => item.returnType === paramsType)
        }
      }
      if (options.length === 0) {
        return null
      }
      let cur = text.split(' ').pop() ?? ''
      if (text.includes(',')) {
        cur = text.split(',').pop() ?? ''
      } else if (text.includes('(')) {
        cur = text.split('(').pop() ?? ''
      }
      // addDeduplicateKey(options.map(item => item.value))
      return pipelineReturnParams({
        from: word.to - cur.length,
        to: word.to,
        filter: false,
        options: options?.map(item => {
          return coverSnippetCompletion(item.template, {
            label: item.label,
            detail: item.label,
            type: item.type,
            boost: item.boost,
          })
        }) ?? []
      }, 'end')
    }
    return null
}
