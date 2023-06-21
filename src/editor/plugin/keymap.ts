import { defaultHotkey, Hotkey } from '../interface'
import { keymap } from '@codemirror/view'
import { Text } from '@codemirror/state'
import {
  closeSearchPanel,
  findNext,
  findPrevious,
  gotoLine,
  openSearchPanel, selectNextOccurrence,
  selectSelectionMatches
} from '@codemirror/search'
import { getEditor } from '../store'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'

export const wordKeymap = (editorRef: React.MutableRefObject<ReactCodeMirrorRef>, hotKey?: Hotkey) => {
  const {
    save,
    cut,
    copy,
    paste
  } = {
    ...defaultHotkey,
    ...(hotKey ?? {})
  }
  return keymap.of([
    {key: save, run: (view) => {
      console.log('view', view)
        // view.cut
      return false}, scope: "editor", preventDefault: true,},
    {key: copy, run: (view) => {
        console.log('view c', view)
        copyToClipboard()
        return false}, scope: "editor", preventDefault: true,},
    {key: paste, run: (view) => {
        console.log('view v', view)
        pasteFromClipboard()
        return false}, scope: "editor", preventDefault: true,},
    {key: cut, run: (view) => {
        console.log('view x', view)
        cutToClipboard()
        return false}, scope: "editor", preventDefault: true,},
  ])
}


// 复制选中文本到剪贴板
function copyToClipboard() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const text = range.toString();
    navigator.clipboard.writeText(text);
  }
}

// 剪切选中文本到剪贴板
function cutToClipboard() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const text = range.toString();
    navigator.clipboard.writeText(text).then(() => {
      range.deleteContents();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  }
}

// 将剪贴板内容粘贴到当前位置
function pasteFromClipboard() {
  navigator.clipboard.readText().then((text) => {
    document.execCommand("insertHTML", false, text);
  });
}
