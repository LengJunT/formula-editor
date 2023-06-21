import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  ForwardRefRenderFunction,
  useMemo,
  forwardRef,
  useEffect, useState
} from 'react'
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { EditorSelection, Extension, StateEffect, StateEffectType, Text } from '@codemirror/state'
import { redo, undo } from '@codemirror/commands'
import { githubLight } from '@uiw/codemirror-theme-github';
// import { snippet } from '@codemirror/autocomplete'
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript'
import './editor.css'
import { getExtensionsPlugin, getExtensionsPluginProps } from './plugin'
import { EditorRefs } from './interface'
import { EditorView, runScopeHandlers } from '@codemirror/view'
import HoverTooltips from './components/hoverTooltips'
import { coverSnippet } from './codermirror'
import { initEditor, useEditorStore } from './store'
import { useObserveHintClose } from './plugin/hint/utils'
import prettier from 'prettier'
import * as parserBabel from 'prettier/parser-babel.js'
import { ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { Button, InputNumber } from 'antd';
import { syntaxTree } from '@codemirror/language'
import { debounce, map} from 'lodash'
import { snippet } from '@codemirror/autocomplete'
import LintTooltips from './components/lintTooltips'

// @ts-ignore
// import prettier from "https://unpkg.com/prettier@2.8.8/esm/standalone.mjs";
// @ts-ignore
// import parserBabel from "https://unpkg.com/prettier@2.8.8/esm/parser-babel.mjs";
interface PropsType extends Omit<getExtensionsPluginProps, 'editorRef'>{
  defaultValue?: string;
  extensions?: Extension[];
  height?: string;
  width?: string;
}

// const CustomPrettierPlugin = {
//   parsers: {
//     'custom-parser': {
//       parse (text: any) {
//         const ast = parserBabel.parsers.babel.parse(text);
//         console.log('CustomPrettierPlugin', ast, text)
//         return ast
//       },
//       astFormat: "estree",
//     }
//   }
// }

const Editor: ForwardRefRenderFunction<EditorRefs, PropsType> = (
  {
    quickMatchMap,
    defaultValue,
    extensions,
    width,height,
    completions,
    hintPaths,
    keywordsClassName,
    keywordsColor,
    keywords,
    operatorKeywords,
    searchContainer,
    hotkey, deletedPlaceholders
  }, ref) => {
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  const insertText = useCallback((text: string, isTemplate?: boolean) => {
    const { view } = editorRef.current!;
    if (!view) return;

    const { state } = view;
    if (!state) return;

    const [range] = state?.selection?.ranges || [];

    let { from, to } = range
    if (!view.hasFocus) {
      from = state.doc.length
      to = state.doc.length
    }
    view.focus();

    if (isTemplate) {
      console.log('text', text)
      coverSnippet(text)(
        {
          state,
          dispatch: view.dispatch,
        },
        {
          label: text,
          detail: text,
        },
        from,
        to
      );
      // console.log('code123123', view.state.doc.toString())
    } else {
      view.dispatch({
        changes: {
          from: from,
          to: to,
          insert: text,
        },
        selection: {
          anchor: from + text.length
        },
      });
    }
  }, []);
  const clearText = useCallback(() => {
    if (!editorRef.current) return
    const { view } = editorRef.current;
    if (!view) return;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: '',
      },
      selection: {
        anchor: 0,
      },
    });
    view.focus();
  }, []);

  const setText = useCallback((text: string) => {
    if (!editorRef.current) return
    const { view } = editorRef.current;
    if (!view) return;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: text,
      },
      selection: {
        anchor: text.length,
      },
    });
    view.focus();
  }, []);
  const oneStrWidth = useCalculateOneStrWidth(14)
  useImperativeHandle(
    ref,
    () => {
      return {
        insertText,
        clearText,
        setText,
        originEditorRef: editorRef,
      };
    },
    [insertText, clearText, setText]
  );

  const setQuickMatchMap = useEditorStore(state => state.setQuickMatchMap)

  useEffect(() => {
    setQuickMatchMap(quickMatchMap)
  }, [quickMatchMap])

  const extensionsMemo = useMemo(() => {
    return [
      ...getExtensionsPlugin({
        quickMatchMap,
        completions,
        hintPaths,
        keywordsClassName,
        keywordsColor,
        keywords,
        operatorKeywords, searchContainer,
        hotkey, editorRef, deletedPlaceholders
      }),
      // javascript(),
      // javascriptLanguage
    ]
    }, [quickMatchMap, completions, operatorKeywords, searchContainer, hotkey, deletedPlaceholders]
  )

  const [value, setValue] = useState(defaultValue??'')
  const [tabSize, setTabSize] = useState(4)
  const [rowLength, setRowLength] = useState(80)

  const handleChange:ReactCodeMirrorProps['onChange'] = (value, viewUpdate) => {
    console.log('handleChange', value)
    setValue(value)
  }

  const handleFormatCode = () => {
    // const doc = prettier.format(value, {
    //   semi: false,
    //   tabWidth: tabSize,
    //   plugins: [parserBabel]
    // })
    if (!editorRef.current) return
    const { view, state } = editorRef.current;
    if (!view || !state) return;
    const doc = state.toText(value)
    const texts: string[] = []
    function formatRow(str: string, _operators: string[], tabSize: number) {
      const operators = _operators.filter(o => o !== '!').map(operator => operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      // 操作符添加空格
      let _str = str.trim().split(' ').join('').replace(new RegExp(`(${operators.join('|')})`, 'g'), ' $1 ')
      // 添加tabSize
      const tabStr = new Array(tabSize ?? 4).fill(' ').join('') + _str
      return tabStr
    }
    if (doc) {
      for (let i = 1; i <= doc.lines; i++) {
        const lineText = doc.line(i)
        // 执行替换操作，将操作符前后的空白字符替换为单个空格
        const output = formatRow(lineText.text, operatorKeywords, tabSize)
        // const t = state.toText(output)
        texts.push(output)
      }
      view.dispatch({
        changes: {
          from: 0,
          to: doc.length,
          insert: texts.join('\n'),
        },
      });
      view.dom.style.width = `${oneStrWidth * rowLength}px`


    }
    // console.log(value, editorRef.current?.state?.doc.text)
    // setText(doc)
  }

  // console.log('lineWrapping', editorRef?.current?.view?.lineWrapping)
  const domRef = useRef<HTMLDivElement>(null)
  // useObserveHintClose(domRef.current)

  return <div id={'a'} ref={domRef}>
    <InputNumber type="number" value={rowLength} placeholder={'单行字符'} onChange={(v) => setRowLength(v ?? 4)}/>
    <InputNumber type="number" value={tabSize} onChange={(v) => setTabSize(v ?? 4)}/>
    <button onClick={handleFormatCode}>格式化</button>
    <Button onClick={() => {
      if (editorRef.current?.view) {
        undo(editorRef.current.view)
      }
    }}>撤销</Button>
    <Button onClick={() => {
      if (editorRef.current?.view) {
        redo(editorRef.current.view)
      }
    }}>重做</Button>
    <ReactCodeMirror
      ref={(ref) => {
        if (ref) {
          editorRef.current = ref
          initEditor(ref)
        }
      }}
      width={width}
      height={height}
      // theme={githubLight}
      extensions={extensionsMemo}
      basicSetup={{
        // lineNumbers: true,
        // lineWrapping: true,
        tabSize: tabSize,
        searchKeymap: false,
        defaultKeymap: false,
        historyKeymap: false,
      }}

      value={value}
      onChange={handleChange}
    />
    <HoverTooltips dom={domRef.current!} quickMatchMap={quickMatchMap} />
    <LintTooltips dom={domRef.current!} />
    <LintBox view={editorRef.current?.view} />
  </div>
}

export default React.memo(forwardRef<EditorRefs, PropsType>(Editor))


const LintBox = (props: {
  view?: EditorView
}) => {
  const lintDiagnostics = useEditorStore(state => state.lintDiagnostics)
  const {view} = props
  if (!view) return  null
  return <div style={{minHeight: '100px'}} >
    <div className={'bg-blue-200 border border-solid border-r-cyan-100'}>问题 {lintDiagnostics.length}</div>
    <ul>
      {
        lintDiagnostics.map(item => {
          return item.data.map(dia => {
            const { severity, message, from, to, actions } = dia
            const isWarning = severity === 'warning'

            let line
            try {
              const pos = view?.state.doc.length < from ? view.state.doc.length : from
              line = view?.state.doc.lineAt(pos)
            } catch (e) {

            }
            let row = 0, col = 0
            if (line) {
              row = line.number
              col = from - line.from + 1
            }

            return <Li
              onDoubleClick={() => {
                const selection = EditorSelection.single(from, to);
                view.dispatch({
                  selection,
                  scrollIntoView: true // 将选择区滚动到视图中心
                });
                view?.focus()
              }}
              onClick={() => {
                const selection = EditorSelection.single(to, to);
                view.dispatch({
                  selection,
                  scrollIntoView: true // 将选择区滚动到视图中心
                });
                view?.focus()
            }}>
              <span className={`w-[20px] h-[20px] inline-block rounded-full text-center ${isWarning ? 'bg-amber-300' : 'bg-red-400'}`}>
              {
                severity === 'warning' ? '!' : 'x'
              }
              </span>
              {message}
              【第{row}行， 第{col}列】
            </Li>
          })
        })
      }
    </ul>
  </div>

  function Li (props: {
    onClick: () => void
    onDoubleClick: () => void
    children: any
  }) {
    const count = useRef<number>(0)
    const onClick = () => {
      count.current += 1;
      setTimeout(() => {
        if (count.current === 1) {
          console.log('single click: ', count.current);
          props.onClick()
        } else if (count.current === 2) {
          console.log('setTimeout onDoubleClick: ', count.current);
          props.onDoubleClick()
        }
        count.current = 0;
      }, 300);
    }
    return <li onClick={onClick}>{props.children}</li>
  }
}

const useCalculateOneStrWidth = (fontSize: number) => {
  const [width, setWidth] = useState(10)
  useEffect(() => {
    const span = document.createElement('span')
    span.textContent = 'a'
    span.style.position = 'fixed'
    span.style.top = '-9999px'
    span.style.left = '-9999px'
    span.style.fontSize = `${fontSize}px`
    document.body.append(span)
    setWidth(span.clientWidth)
    span.remove()
  }, [fontSize])
  return width
}
