// import { hintHoc } from './utils'
// import { extractLastPlaceholder } from '../../../utils'
// import { CompletionsTypeEnum, HintBoots, QuickMatchMap } from '../../interface'
// import { coverSnippetCompletion } from '../../codermirror'
//
// /**
//  * 标签的提示
//  * @param {QuickMatchMap} quickMatchMap
//  * @returns {CompletionSource}
//  */
// export const placeholdersHint = (quickMatchMap: QuickMatchMap) => {
//   return hintHoc(({ word, path, latestChar} ) => {
//     // // 如果是}.结尾的，代表是 标签
//     if (path.endsWith('}.')) {
//       const latestVarPath = extractLastPlaceholder(path)
//       if (latestVarPath) {
//         const latestVars = latestVarPath.split('.')
//         const latestVar = latestVars[latestVars.length - 1]
//         const data = quickMatchMap[latestVar]
//         // if (data && data.children?.length) {
//         const options = data?.children?.map((item: any) => {
//           // return {
//           //   label: `$\{${latestVars.join('.')}.${item.value}}`,
//           //   detail: item.label,
//           //   type: CompletionsTypeEnum.OBJECT,
//           //   boost: HintBoots.object
//           // }
//           return coverSnippetCompletion(`$\{${latestVars.join('.')}.${item.value}}`, {
//             label: item.label,
//             detail: item.label,
//             type: item.type,
//             boost: HintBoots.object,
//           })
//         }) ?? []
//         return {
//           from: word.to - latestVarPath.length - 4,
//           to: word.to,
//           filter:false,
//           options: options
//         }
//       }
//     }
//     return null
//   })
// }

export {}
