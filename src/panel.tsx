import React, { useState } from 'react'
import { EditorView, MatchDecorator } from '@codemirror/view'
import { EditorState, SelectionRange } from '@codemirror/state'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { CompletionsType, EditorRefs } from './editor'
import { operatorCompletions, FieldDataList, functionCompletions } from './store'
import { CompletionsTypeEnum } from './editor/interface'
import { findNodeAndParents } from './utils'


type FieldItem = {
  label: string,
  value: string,
  info?: string
  style?: string,
  className?:string
}
export const FieldListInfo: Record<string, {
  name: string,
  type: string
  id: string
  code: string
}> = {
  'username': {
    name: '用户名称',
    type: '基础对象',
    id: 'K1234',
    code: 't_hr-23',
  },
  'creatUser': {
    name: '创建人',
    type: '基础对象',
    id: 'KMK3',
    code: 't_Usr',
  },
}

// export const FunctionList = [
//   { label: 'DELETE', value: 'DELETE' },
//   { label: '创建人', value: 'creatUser' },
//   { label: '修改时间', value: 'setTime' }
// ]

const NoBlurDiv = (props:  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return <div {...props} onMouseDown={(event) => {
    event.preventDefault()
  }} />
}

const Panel = (props: {
  editor?: EditorView
  editorRef: React.MutableRefObject<EditorRefs | undefined | null>
}) => {
  const { editor, editorRef } = props
  const handleAddField = (item: FieldItem) => () => {
    const list = findNodeAndParents(FieldDataList, item.value)
    const value = list?.map(item => item.value)?.join('.')
    editorRef.current?.insertText?.(`$\{${value}} `, false)
    // editorRef.current?.insertText?.(`[[${value}]]`, false)
  }

  const handleAddOperator = (item: CompletionsType) => () => {
    editorRef.current?.insertText?.(item.template, false)
  }

  const handleAddCode = (item: any) => () => {
    editorRef.current?.insertText?.(item.template, true)
  }

  const list = [
    {
      title: '字段',
      data: FieldDataList,
    },{
      title: '函数',
      data: functionCompletions,
    },{
      title: '操作符号',
      data: operatorCompletions,
    },
  ]

  const renderList = (data: any) => {
    return data.map((item: any) => {
        const label = item.returnType ? item.paramsType ? `${item.label}: (${item.paramsType.types?.join(',')}${item.paramsType.length === -1 ? ', ...' : ''})  => ${item.returnType}` : `${item.label} - ${item.returnType}` : item.label
      if ('value' in item) {
        const dom = <NoBlurDiv className={'cursor-pointer'} onClick={handleAddField(item)} key={item.value}>{label}</NoBlurDiv>
        if ('children' in item) {
          return <div>
            {dom}
            <div className={'pl-2.5'}>
              {renderList(item.children)}
            </div>
          </div>
        }
        return dom
      }
      // const label = item.returnType ? `${item.label} - ${item.returnType}` : item.label
      return <NoBlurDiv className={'cursor-pointer'} onClick={item.type === CompletionsTypeEnum.OPERATOR ? handleAddOperator(item) : handleAddCode(item)} key={item.label}>{label}</NoBlurDiv>
    })
  }

  return <div className={'flex'}>
    {
      list.map(l => {
        return  <div key={l.title} className={'flex-1 w-[150px] border'}>
          <h4>{l.title}</h4>
          <div className={'pl-2.5'}>
            {renderList(l.data)}
          </div>
        </div>
      })
    }
  </div>
}

export default React.memo(Panel)

