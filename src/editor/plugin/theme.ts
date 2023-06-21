import { EditorView } from '@codemirror/view'
import {HighlightStyle} from "@codemirror/language"
import { tags as t } from "@lezer/highlight"
import { TOOLTIP_KEY } from '../components/hoverTooltips'

export const newHighlightStyle = HighlightStyle.define([
  // {tag: [t.operator], class: TOOLTIP_KEY.CLS_OPERATOR},
])
export const Theme = EditorView.baseTheme({
  '&light .line-color': { backgroundColor: 'blue' },
  '&light .cm-activeLine': { border: '1px solid rgba(0,0,0,0.06)'},
  '&light  .cm-completionIcon-CP': { color: 'red' },
  '& .code-autocomplete-tooltip.cm-tooltip.cm-tooltip-autocomplete > ul': {maxHeight: '60em'},
  '& .cm-field-var-widget': {
    display: 'inline-block',
    padding: '2px 4px',
    fontSize: '12px',
    fontFamily: 'PingFangSC-Regular, PingFang SC',
    fontWeight: 400,
    color: '#00B578',
    lineHeight: '16px',
    background: 'rgba(0,181,120,0.08)',
    borderRadius: '2px'
  },
  "& .cm-gutterElement.cm-indentGuide": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  // "& .code-autocomplete-tooltip .cm-completionLabel": {
  //   display: 'none'
  // }
});
