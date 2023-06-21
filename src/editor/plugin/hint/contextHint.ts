// import { CompletionsTypeEnum, HintBoots, QuickMatchMap } from '../../interface'
// import { hintHoc } from './utils'
// import { extractStringArrayPlaceholders } from '../../../utils'
// import { Completion, CompletionContext, snippetCompletion } from '@codemirror/autocomplete'
//
// export const contextHint = (quickMatchMap: QuickMatchMap) => {
//   return hintHoc(({
//     word, context
//   }) => {
//     const doc = context.state.doc
//     const labelKeys = extractStringArrayPlaceholders(doc.toJSON())
//     const options: any[] = []
//     // const labelMap = {}
//     labelKeys.forEach((keys) => {
//       keys.forEach((key) => {
//         const opt = quickMatchMap[key]
//         if (opt) {
//           options.push(opt)
//           // labelMap[key] = opt
//         }
//       })
//     })
//     console.log('contextHint', labelKeys, options,  doc.toJSON())
//     return {
//       from: word.from,
//       options: options.map(item => {
//         // return {
//         //   label: `$\{${item.value}}`,
//         //   detail: item.label,
//         //   type: CompletionsTypeEnum.OBJECT,
//         //   boost: 99
//         // }
//         return snippetCompletion('${' + item.value + '}',{
//           label: item.label,
//           detail: item.label,
//           type: CompletionsTypeEnum.OBJECT,
//           boost: 99
//         })
//       })
//     }
//   })
// }


export {}
