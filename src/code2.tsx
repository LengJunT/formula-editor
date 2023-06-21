import React, { useRef, useState } from 'react'
import { CompletionsType, Editor, EditorRefs, FunctionCompletionsType } from './editor'
import Panel from './panel'
import { functionCompletions, operatorCompletions, FieldDataList } from './store'
import { CompletionsTypeEnum, defaultHotkey } from './editor/interface'
import { findNodeAndParents, flattenTree, getEventKey } from './utils'
import { fromEvent, Observable, Subscription } from 'rxjs'

function getPlaceholderInfo (value: string) {
  return findNodeAndParents(FieldDataList, value)
}

let keys: any[] = []

const Code2 = () => {
  const ref = useRef<EditorRefs>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const completions = [...functionCompletions, ...flattenTree(FieldDataList)]

  const keywords = completions.map(item => item.label)

  const quickMatchMap: Record<string, any> = {}
  completions.forEach(item => {
    quickMatchMap[item.value ?? item.label] = item
  })
  const operatorKeywords = operatorCompletions.map(item => item.label)
  console.log('123', keywords, completions, quickMatchMap)
  const [keymap, setKeymap] = useState(defaultHotkey)
  const keydownSub = useRef<Subscription>()
  const handleKeymap = () => {
    keys = []
    keydownSub.current = fromEvent(window, 'keydown').subscribe((event) => {
      event.preventDefault();
      keys.push((event as KeyboardEvent).key)
      console.log('键盘 keydown', keys)
    })
  }
  const onBlur = (type: string) => () => {
    console.log('键盘 onblur')
    keydownSub.current?.unsubscribe()
    setKeymap({
      ...keymap,
      [type]: keys.join('-')
    })
  }
  return <>
    {/*<div className={'search-box'} ref={searchRef}></div>*/}
    <div>
      点击重置失焦确定
      <div className={'keymap focus:border-2'} tabIndex={-1} onFocus={handleKeymap} onBlur={onBlur('openSearch')}>打开搜索：{keymap.openSearch}</div>
      <div className={'keymap focus:border-2'} tabIndex={-1} onFocus={handleKeymap} onBlur={onBlur('save')}>保存：{keymap.save}</div>
      <div className={'keymap focus:border-2'} tabIndex={-1} onFocus={handleKeymap} onBlur={onBlur('copy')}>复制：{keymap.copy}</div>
      <div className={'keymap focus:border-2'} tabIndex={-1} onFocus={handleKeymap} onBlur={onBlur('cut')}>剪切：{keymap.cut}</div>
      <div className={'keymap focus:border-2'} tabIndex={-1} onFocus={handleKeymap} onBlur={onBlur('paste')}>粘贴：{keymap.paste}</div>
    </div>
    <Editor
      ref={ref}
      // searchContainer={searchRef.current}
      width={'600px'}
      height={'300px'}
      defaultValue={`$\{user}
      bc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acbabc acb acb
      1 + 1 = 2
      const a = () => {console.log(1)}
      function b () { console.log(2)}
      if (true) {
        a()
      } else {
        b()
      }
      `}
      // getPlaceholderInfo={getPlaceholderInfo as any}
      completions={completions}
      keywords={keywords}
      hotkey={keymap}
      keywordsColor={'red'}
      quickMatchMap={quickMatchMap}
      operatorKeywords={operatorKeywords}
      hintPaths={[{
        label: 'user',
        template: 'user',
        detail: '用户',
        type: 'variable',
        children: [{
          label: 'department',
          template: 'department',
          detail: '部门',
          type: 'property',
          children: [{
            label: 'name',
            template: 'name',
            detail: '名称',
            type: 'property',
          }],
        }],
      }]}
    />
    <Panel editorRef={ref} />

  </>
}

export default Code2
