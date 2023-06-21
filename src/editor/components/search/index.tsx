import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Input } from 'antd'
import {
  SearchQuery,
  findNext,
  findPrevious,
  closeSearchPanel,
  setSearchQuery,
  replaceNext,
  replaceAll,
  openSearchPanel, selectSelectionMatches, gotoLine, selectNextOccurrence
} from '@codemirror/search'
import { EditorView, KeyBinding, keymap } from '@codemirror/view'
import { useEditorStore } from '../../store'
import { Hotkey } from '../../interface'

type HandleIdx = (callback?: (view: EditorView) => boolean)=> (view: EditorView) => boolean

const handleIdx: HandleIdx = (callback?: (view: EditorView) => boolean)=> (view: EditorView) => {
  const { setSearchCountAndIndex } = useEditorStore.getState()
  const data = callback?.(view)
  const sdom = document.querySelectorAll('.cm-searchMatch')
  let idx = 0
  for (let i =0;i<sdom.length;i++) {
    const item = sdom[i]
    if (item.className.includes('cm-searchMatch-selected')) {
      idx = i + 1
      break
    }
  }
  setSearchCountAndIndex(idx, sdom.length)
  return data ?? false
}

export const searchKeymap = (hotKey?: Hotkey) => {
  return keymap.of([
    {key: hotKey?.openSearch ?? "Mod-f", run: handleIdx(openSearchPanel), scope: "editor search-panel"},
    {key: "F3", run: handleIdx(findNext), shift: findPrevious, scope: "editor search-panel", preventDefault: true},
    {key: "Mod-g", run: handleIdx(findNext), shift: findPrevious, scope: "editor search-panel", preventDefault: true},
    {key: "Escape", run: handleIdx(closeSearchPanel), scope: "editor search-panel"},
    {key: "Mod-Shift-l", run: handleIdx(selectSelectionMatches)},
    {key: "Alt-g", run: handleIdx(gotoLine)},
    {key: "Mod-d", run: handleIdx(selectNextOccurrence), preventDefault: true},
  ])
}

export const Search = (props: {
  editorView: EditorView
}) => {
  const { editorView } = props
  const count = useEditorStore(state => state.searchCount)
  const index = useEditorStore(state => state.searchCurIndex)
  const [str, setStr] = useState(undefined)
  const [replace, setReplace] = useState(undefined)
  const [wholeWord, setWholeWord] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [regexp, setRegexp] = useState(false)

  useEffect(() => {
    if (typeof str === 'string') {
      const query = new SearchQuery({
        search: str,
        replace: replace,
        wholeWord, caseSensitive, regexp
      })
      editorView.dispatch({effects: setSearchQuery.of(query)})
      // if (!editorView.hasFocus) {
      //   editorView.focus()
      // }
      setTimeout(() => {
        handleIdx()(editorView)
      }, 10)
    }
  }, [str, caseSensitive, wholeWord, regexp, replace])


  const handleClick = (callback: (view: EditorView) => boolean) => () => {
    callback(editorView)
  }

  const handleNext = handleClick(handleIdx(() => {
    return findNext(editorView)
  }))
  const handlePre = handleClick(handleIdx(() => {
    return findPrevious(editorView)
  }))

  const handleClose = handleClick(handleIdx(() => {
    return closeSearchPanel(editorView)
  }))

  const handleReplaceNext = handleClick(handleIdx(() => {
    return replaceNext(editorView)
  }))
  const handleReplaceAll = handleClick(handleIdx(() => {
    return replaceAll(editorView)
  }))

  return <div className={'search2'}>
    <div>
      <Input value={str} width={200} onChange={(e) => {
        console.log(1, e)
        setStr(e.target.value as any)
      }} addonAfter={<div>
        <Checkbox value={wholeWord} onChange={e => {
          setWholeWord(e.target.checked)
        }} >ab</Checkbox>
        <Checkbox value={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} >Aa</Checkbox>
        <Checkbox value={regexp} onChange={e => setRegexp(e.target.checked)}>*</Checkbox>
      </div>} />
      <span>{index}/{count}</span>
      <Button onClick={handlePre}>上</Button>
      <Button onClick={handleNext}>下</Button>
      <Button onClick={handleClose}>x</Button>
    </div>
    <div>
      <Input value={replace} width={200}  onChange={(e) => {
        console.log(1, e)
        setReplace(e.target.value as any)
      }} />
      <Button onClick={handleReplaceNext}>替换</Button>
      <Button onClick={handleReplaceAll}>全部替换</Button>
    </div>
  </div>
}
