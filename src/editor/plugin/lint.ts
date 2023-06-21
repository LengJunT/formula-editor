import {linter, Diagnostic} from "../codermirror/lint"
import { functionNameRegex } from '../../utils'
import { useEditorStore } from '../store'
import { EditDiagnostics } from '../interface'

const oldFunctionMap: Record<string, string> = {
  'text': 'str'
}


/**
 * 判断旧函数
 * @param {string} doc
 * @param {Diagnostic[]} diagnostics
 */
const handleOldFunctionWarning = (doc: string, diagnostics: EditDiagnostics) => {
  // const names = []
  // let match;
  // while ((match = functionNameRegex.exec(doc)) !== null) {
  //   if (match[1]) {
  //     names.push(match[1])
  //   }
  // }
  // names.forEach((name, idx) => {
  //   if (oldFunction.includes(name)) {
  //
  //   }
  // })
  const data: Diagnostic[] = []
  Object.keys(oldFunctionMap).forEach(name => {
    const fun = `${name}(`
    if (doc.includes(fun)) {
      const arr = doc.split(fun)
      arr.pop();
      arr.forEach((text, idx) => {
        const before = arr.slice(0, idx + 1)
        const newName = oldFunctionMap[name]
        const from = before.join(fun).length
        const message = `不推荐使用【${name}】函数，推荐使用【${newName}】函数`
        data.push({
          from: from,
          to: from + name.length,
          severity: 'warning',
          message,
          // renderMessage () {
          //   const dom = document.createElement('div')
          //   dom.innerText = message
          //   return dom
          // },
          // actions: [
          //   {
          //     name: '替换',
          //     apply: function (view, from, to) {
          //       view.dispatch({
          //         changes: {
          //           from, to,
          //           insert: newName
          //         }
          //       })
          //     }
          //   }
          // ]
        })
      })
    }
  })
  diagnostics.push({
    type: 1,
    data
  })
}

const handleUnmatchedPunctuation = (doc: string, diagnostics: EditDiagnostics) => {
  const o = getOpts(doc)
  const error = removeAdjacentPairs(o)
  const data: Diagnostic[] = []
  error.forEach(e => {
    data.push({
      from: e.i,
      to: e.i + 1,
      severity: 'error',
      message: `符号【${e.s}】未闭合`
    })
  })
  diagnostics.push({
    type: 3,
    data
  })
}

const handleGrammarRules = (doc: string, diagnostics: EditDiagnostics) => {
  const data: Diagnostic[] = []
  const key = ' '
  // 先按空格切割
  // 如果内容是中文且没有用引号包，报错
  // 如果内容是英文且不是函数，对象。且没有用引号包，报错
  const strArr = doc.split(key)
  strArr.forEach((_str, idx) => {
    const str = _str.endsWith('\n') ? _str.split('\n')[0] : _str
    if (str.length) {
      // 仅中文或仅英文
      // if (/[^\x00-\xff]+$/.test(str) || (/[\x00-\xff]+$/.test(str) && str.includes('(') || str.includes('('))) {
      if (/[^\x00-\xff]+$/.test(str) || /[a-zA-Z!@#$%&*]+$/.test(str)) {
        // 没用引号包
        if (!(str.startsWith('"') && str.endsWith('"') || str.startsWith("'") && str.endsWith("'"))) {
          const before = strArr.slice(0, idx)
          const from = before.length === 0 ? 0 : before.join(key).length + 1
          const message = `公式中有语法错误，该标识不合法 【${str}】`
          data.push({
            from,
            to: from + str.length,
            severity: 'error',
            source: str,
            message,
          })
        }
      }
    }
  })
  diagnostics.push({
    type: 2,
    data
  })
}


const delObjValue = ['setTime', 'creatUser']
const handleDelObject = (doc: string, diagnostics: EditDiagnostics) => {
  const data: Diagnostic[] = []
  const quickMatchMap = useEditorStore.getState().quickMatchMap
  delObjValue.forEach(obj => {
    const key = '${' + obj + '}'
    const arr = doc.split(key)
    arr.pop()
    arr.forEach((str, idx) => {
      const before = arr.slice(0, idx + 1)
      const from = before.join(key).length
      const name = quickMatchMap[obj]
      const message = `【${name.label ?? obj}】已被删除，请重新选择`
      data.push({
        from: from,
        to: from + key.length,
        severity: 'error',
        source: obj,
        message,
      })
    })
  })
  diagnostics.push({
    type: 4,
    data
  })
}

export const Lint = () => {
  return linter((view) => {
    const diagnostics: EditDiagnostics = []
    const docStr = view.state.doc.toString()
    handleOldFunctionWarning(docStr, diagnostics)
    handleUnmatchedPunctuation(docStr, diagnostics)
    handleDelObject(docStr, diagnostics)
    handleGrammarRules(docStr, diagnostics)
    const setLintDiagnostics = useEditorStore.getState().setLintDiagnostics
    setLintDiagnostics(diagnostics)
    return diagnostics.map(item => item.data).flat(1)
  }, {
    tooltipFilter: () => []
  })
}


/**
 * 取出符号
 * @param {string} str
 * @returns {any[]}
 */
function getOpts (str: string) {
  const dic = ['"', "'", '[', '{', '(', ')', '}', ']']
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const cur = str[i];
    // 左括号入栈
    if (dic.includes(cur)) {
      result.push({
        s: cur, i,
      });
    }
  }
  return result
}

/**
 * 成对去除
 * @param {{s: string, i: number}[]} arr
 * @returns {{s: string, i: number}[]}
 */
function removeAdjacentPairs(arr: {
  s: string, i:number
}[]) {
  const stack:{
    s: string, i:number
  }[] = [];
  const pairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'"
  }
  for (let i = 0; i < arr.length; i++) {
    const char = arr[i];

    if (stack.length > 0 && pairs[stack[stack.length - 1]?.s] === char.s) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }
  return stack;
}

