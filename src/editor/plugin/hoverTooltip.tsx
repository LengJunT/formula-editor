// import {Tooltip, hoverTooltip, TooltipView} from "@codemirror/view"
// import ReactDOM from 'react-dom/client'
// import TooltipCard from '../components/tooltipCard'
// import { Popover } from 'antd'
// import { useEffect, useRef } from 'react'
//
// // TooltipView
//
// export const wordHoverTooltips = hoverTooltip((view, pos, side) => {
//   let {from, to, text} = view.state.doc.lineAt(pos)
//   let start = pos, end = pos
//   while (start > from && /\w/.test(text[start - from - 1])) start--
//   while (end < to && /\w/.test(text[end - from])) end++
//   if (start == pos && side < 0 || end == pos && side > 0)
//     return null
//   return {
//     pos: start,
//     end,
//     above: true,
//     create(view) {
//       let dom = document.createElement("span")
//       const root = ReactDOM.createRoot(dom)
//       root.render(<Popover open content={<TooltipCard type={'field'} value={'username'} />} getPopupContainer={() => dom}></Popover>)
//       // dom.textContent = text.slice(start - from, end - from)
//       return {
//         dom,
//         destroy() {
//           root.unmount()
//         }
//       }
//     }
//   }
// }, {
//   hideOn: (tr, tooltip) => {
//     console.log('hideOn', tr, tooltip)
//     return false
//   }
// })

export  {}
