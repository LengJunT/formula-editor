//
// import { addDeduplicateKey, deduplicationHintOptions, hintHoc } from './utils'
// import { useEditorStore } from '../../store'
// import { curInputFunParamIndex, extractLastIncompleteFunction } from '../../../utils'
// import { coverSnippetCompletion } from '../../codermirror'
// import { HintBoots } from '../../interface'
//
// // 函数提示
// export const functionHint = () => {
//   return hintHoc(({
//                      context, latestChar, path
//                   }) => {
//     console.log('hint hint', 'functionHint', new Date().getTime())
//     const  quickMatchMap= useEditorStore.getState().quickMatchMap
//     const word = context.matchBefore(/.*/g)
//     if (!word) return null
//     const text = word.text
//     // 取出当前输入函数的名称
//     const lastFunctionName = extractLastIncompleteFunction(text)
//     const functionInfo = quickMatchMap[lastFunctionName]
//     // paramsTypes length为0 代表没有参数，-1代表无限
//     if (!functionInfo || !functionInfo?.paramsType || functionInfo?.paramsType?.length === 0) return null
//     // 获取参数的索引
//     const index = curInputFunParamIndex(text, lastFunctionName)
//     if ( typeof index === 'number') {
//       const { length, types } = functionInfo.paramsType
//       // 参数无限就取第一个
//       const curParamsType = length === -1 ? types[0] : types?.[index]
//       const options = deduplicationHintOptions(Object.values(quickMatchMap).filter(item => item.returnType == curParamsType))
//       console.log('functionHint111',word, path, latestChar, index, options, curParamsType, functionInfo.paramsType)
//       let cur = text.split(' ').pop() ?? ''
//       if (text.includes(',')) {
//         cur = text.split(',').pop() ?? ''
//       } else if (text.includes('(')) {
//         cur = text.split('(').pop() ?? ''
//       }
//       addDeduplicateKey(options.map(item => item.value))
//       return {
//         from: word.to - cur.length,
//         to: word.to,
//         filter: false,
//         options: options?.map(item => {
//           return coverSnippetCompletion(item.template, {
//             label: item.label,
//             detail: item.label,
//             type: item.type,
//             boost: item.boost,
//           })
//         }) ?? []
//       }
//     }
//     console.log('functionHint',lastFunctionName, index, functionInfo)
//     return null
//   })
// }

export {}
