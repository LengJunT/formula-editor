import React, { useEffect, useMemo, useRef } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { defaultKeymap, indentWithTab } from "@codemirror/commands"
import {
  Decoration,
  DecorationSet,
  EditorView,
  keymap,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType
} from '@codemirror/view'
// import { basicSetup } from 'codemirror'
import { HekitUiIcon, LIB } from '@hekit/hekit-icon'
import './code.css'
import { Completion, autocompletion, CompletionContext, currentCompletions } from '@codemirror/autocomplete';
import ReactDOM from 'react-dom/client'
import { EditorState } from '@codemirror/state'
import {  placeholdersPlugin } from './editor/plugin/placeholders'
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
//
// const themeDemo = EditorView.baseTheme({
//   '&light .line-color': { backgroundColor: 'blue' },
//   '&light .cm-activeLine': { border: '1px solid rgba(0,0,0,0.06)'},
//   '&light .cm-completionIcon-CP': { color: 'red' },
//   '& .cm-field-var-widget': {
//     display: 'inline-block',
//     padding: '2px 4px',
//     fontSize: '12px',
//     fontFamily: 'PingFangSC-Regular, PingFang SC',
//     fontWeight: 400,
//     color: '#00B578',
//     lineHeight: '16px',
//     background: 'rgba(0,181,120,0.08)',
//     borderRadius: '2px'}
// });
//
//
//
// const fieldVarMatcher = new MatchDecorator({
//   // regexp: /\${([^}]+)}/g,
//   // regexp: /\${(.*?)}/g,
//   regexp: /\[\[(.+?)\]\]/g,
//   decoration: (match) => {
//     return Decoration.widget({
//       widget: new FieldVarWidget(match[1]),
//     })
//   }
// })
//
// const FieldVarViewPlugin = ViewPlugin.fromClass(class  {
//   FieldVar: DecorationSet
//   constructor (view: EditorView) {
//     this.FieldVar = fieldVarMatcher.createDeco(view)
//   }
//   update(update: ViewUpdate) {
//     this.FieldVar = fieldVarMatcher.updateDeco(update, this.FieldVar)
//   }
// }, {
//   decorations: instance => instance.FieldVar,
//   provide: plugin => EditorView.atomicRanges.of(view => {
//     return view.plugin(plugin)?.FieldVar || Decoration.none
//   })
// })
//
// class FieldVarWidget extends WidgetType {
//   constructor(readonly name: string) {
//     super()
//   }
//   eq(other: FieldVarWidget) {
//     console.log('w eq', this.name, other.name, other)
//     return this.name == other.name
//   }
//
//   toDOM (view: EditorView): HTMLElement {
//     let span = document.createElement('span')
//     span.className = 'cm-field-var-widget'
//     const curField = FieldList.find(item => item.value === this.name)
//     span.textContent = curField?.label ?? this.name
//     return span
//   }
//   ignoreEvent() {
//     return true;
//   }
// }
//
// function handleCompletionsLabel (view: EditorView, completion:Completion, form: number, to: number) {
//   console.log('handleCompletionsLabel', view, completion, form, to)
//   return '123'
// }
//
// const  handleCompletions = (context: CompletionContext) => {
//   let word = context.matchBefore(/\w*/)
//   if (!word) return null
//   console.log('handleCompletions', context, word)
//   if (word && word?.from == word?.to && !context.explicit) return null
//   return {
//     from: word.from,
//     options: [
//       {label: "C1", type: "CP"},
//       {label: "C2", type: "keyword"},
//       {label: "c3", type: "variable", info: "(World)"},
//       {label: "c4", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"},
//       {label: 'C.function', type: 'function'},
//       {label: "c.fun", type: "function", apply: handleCompletionsLabel, detail: "macro"},
//       {label: "C.master", type: "master"},
//     ]
//   }
// }

function Code() {
  const editor = useRef(null);

  const editorRef = useRef<ReactCodeMirrorRef>()
  const editorStateRef = useRef<EditorState>()
  useEffect(() => {
    if (!editorRef.current && editor.current) {
      // const startState = EditorS
      const editorState = EditorState.create({
        doc: 'Hello World 123 ${name.大} ${name.小} [[name2]][[name3]] [[name.单选字段]]] [[单选字段]]',
        extensions: []
      });
      const a = new EditorView({
        state: editorState,
        parent: editor.current!
      })
      // editorRef.current = a
      editorStateRef.current = editorState
      document.querySelector('#btn')?.addEventListener('click', function (){
        console.log('1ccc', editorState.selection.ranges)
      })
      console.log('mmm', a)
    }
    return () => {
      console.log('销毁')
      // editorRef.current?.destroy()
      editorRef.current = undefined
    }
  }, []);

  const ex = useMemo(() => {
    return [
      placeholdersPlugin({})
    ]
  }, [])

  return <>
    <button onClick={() => {
      console.log('1',
        editorStateRef.current?.selection.main,
        editorStateRef.current?.doc,
        editorStateRef.current?.toText(`hellow
        wod`),
        editorStateRef.current?.doc,
      )

    }
    }>123</button>
    <button id={'btn'}>ccc</button>
    {/*<ReactCodeMirror ref={editorRef} extensions={ex} />*/}
    <div ref={editor} />
    {/*<Panel editorRef={editorRef} />*/}
  </>
}

export default React.memo(Code)
