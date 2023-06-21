import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Code from './code'
import Code2 from './code2'
import { styleTags, tags as t, classHighlighter, tagHighlighter } from "@lezer/highlight"
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { githubLight, githubLightInit } from '@uiw/codemirror-theme-github';
import { createTheme } from '@uiw/codemirror-themes';
import { LRLanguage, syntaxHighlighting } from '@codemirror/language'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import {HighlightStyle} from "@codemirror/language"

const myHighlightStyle = HighlightStyle.define([
  {tag: [t.lineComment, t.keyword], class: 'kkkkk-key'}
])

function App() {

  const [show, setShow] = useState(false)
  useEffect(() => {
    fetch("http://cpfs.successchannel.net/config/unifiedConfig/797fd4a0-3c75-4b14-8c89-d61153dd2aa3.json?t=" + Date.now(), {
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    })
      .then(re => re.json())
      .then(re => {
        const w = window as any
        w['UNIFIED_CONFIG'] = {};
        w['UNIFIED_CONFIG']['cphub:icon'] = re.data;
        setShow(true)
        console.log('1233', re.data)
      });
  }, [])

  const value = `
  1 + 2 = 3;
  3 !== 4;
  SUM DEL
  > < >= <= 
  // "" ''
  `


  // @ts-ignore
  return (
    <div className="App">
      {/*<ReactCodeMirror*/}
      {/*  value={value}*/}
      {/*  theme={createTheme({*/}
      {/*    theme: 'light',*/}
      {/*    settings: {},*/}
      {/*    styles: [*/}
      {/*      // {tag: [t.literal], color:  'red'},*/}
      {/*      {tag: [t.lineComment, t.keyword], color:  '#6266c1', class: 'aaa-b'},*/}
      {/*      {tag: [t.character], color:  'orangered'},*/}
      {/*      {tag: [t.operator], color:  '#ff2200'},*/}
      {/*      { tag: [t.string], color: 'red'},*/}
      {/*      // { tag: [t.compareOperator], color: '#6266c1'},*/}
      {/*    ]*/}
      {/*  })}*/}
      {/*  extensions={[*/}
      {/*    // myLanguage,*/}
      {/*    // githubLight,*/}
      {/*    // myHighlightStyle as any,*/}
      {/*    // syntaxHighlighting(myHighlightStyle),*/}
      {/*    // HekitFormulaLanguage(),*/}
      {/*    javascriptLanguage*/}
      {/*  ]}*/}
      {/*/>*/}
      {/*<Code/>*/}
      <Code2 />
      {/*{show && <Code/>}*/}
    </div>
  );
}

export default React.memo(App)

