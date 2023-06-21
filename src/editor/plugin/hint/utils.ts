import { CompletionContext, CompletionResult, CompletionSource } from '@codemirror/autocomplete'
import { HintBoots, QuickMatchMap } from '../../interface'
import {
  curInputFunParamIndex,
  deduplicateAndFlatten,
  extractLastIncompleteFunction,
  extractStringArrayPlaceholders, filterQuickMatchMapByReturnType
} from '../../../utils'
import { useEditorStore } from '../../store'
import { useEffect, useRef } from 'react'

/**
 * 获取上下文存在的标签列表
 * @param {CompletionContext} context
 * @param {QuickMatchMap} quickMatchMap
 * @returns {any[]}
 */
const getContextPlaceholdersList = (context: CompletionContext, quickMatchMap: QuickMatchMap) => {
  const doc = context.state.doc
  const labelKeys = deduplicateAndFlatten(extractStringArrayPlaceholders(doc.toJSON()))
  const options: any[] = []
  // const labelMap = {}
  labelKeys.forEach((key) => {
    const opt = quickMatchMap[key]
    if (opt) {
      options.push({
        ...opt,
        boost: HintBoots.context,
      })
    }
  })
  return options
}

export interface hintPipelineLogicProps {
  word: { from: number; to: number; text: string };
  /**
   * 最后一个非空字符
   */
  latestChar: string;
  context: CompletionContext;
  contextPlaceholdersList: any[];
  curLineText: string;
  /**
   * 提示类型
   */
  paramsType: string | null
  quickMatchMap: QuickMatchMap
}

type hintPipelineLogicEndData = CompletionResult | Promise<CompletionResult | null> | null
type hintPipelineLogicEnd =  {
  state: 'end',
  data: hintPipelineLogicEndData
}
type hintPipelineLogicPipe =  {
  state: 'pipe',
  data: hintPipelineLogicProps
}
export type hintPipelineLogic = (data: hintPipelineLogicProps) => hintPipelineLogicEnd | hintPipelineLogicPipe | null

type HOC = (data: hintPipelineLogicProps) => hintPipelineLogicEndData
export const hintHoc = (logic: HOC): CompletionSource => {
  return (context: CompletionContext) => {
    // 匹配当前输入前面的所有非空字符
    // const word = context.matchBefore(/\S*/);
    // 输入前面所有字符
    const word = getBeforeWord(context)
    // 判断如果为空，则返回null
    if (!word || (word?.from == word?.to && !context.explicit)) return null;

    // 获取最后非空一个字符
    const latestChar = word.text.trim()[word.text.trim().length - 1];

    // 获取当前输入行所有文本
    const curLineText = context.state.doc.lineAt(context.pos).text;

    const _quickMatchMap= useEditorStore.getState().quickMatchMap
    const paramsType = getCompletionParamsType(context, _quickMatchMap)
    let quickMatchMap = paramsType ? filterQuickMatchMapByReturnType(_quickMatchMap, paramsType) : _quickMatchMap
    // if (paramsType) {
    //   Object.keys((key: string) => {
    //     const item = _quickMatchMap[key]
    //     if (!item.paramsType) {
    //       quickMatchMap[key] = item
    //     } else if (item.paramsType === paramsType) {
    //       quickMatchMap[key] = item
    //     }
    //   })
    // }
    const contextPlaceholdersList = getContextPlaceholdersList(context, quickMatchMap)

    const data = logic({
      word, latestChar, context, contextPlaceholdersList, curLineText, paramsType, quickMatchMap
    })
    // if (data?.state === 'end') {
    //   return data.data
    // }
    return data
  }
}

/**
 * 获取完成提示内容的类型，用于过滤后续的数据
 * @param {CompletionContext} context
 * @param {QuickMatchMap} quickMatchMap
 * @returns {any}
 */
const getCompletionParamsType = (context: CompletionContext, quickMatchMap: QuickMatchMap) => {
  const word = getBeforeWord(context)
  if (!word) return null
  const text = word.text
  // 取出当前输入函数的名称
  const lastFunctionName = extractLastIncompleteFunction(text)
  const functionInfo = quickMatchMap[lastFunctionName]
  // paramsTypes length为0 代表没有参数，-1代表无限
  if (!functionInfo || !functionInfo?.paramsType || functionInfo?.paramsType?.length === 0) return null
  // 获取参数的索引
  const index = curInputFunParamIndex(text, lastFunctionName)
  if ( typeof index === 'number') {
    const {length, types} = functionInfo.paramsType
    // 参数无限就取第一个
    return length === -1 ? types[0] : types?.[index]
  }
  return null
}

let deduplicationOptionKey: string[] = []

export function addDeduplicateKey (key: string | string[]) {
  if (Array.isArray(key)) {
    deduplicationOptionKey = [...deduplicationOptionKey, ...key]
  } else {
    deduplicationOptionKey.push(key)
  }
}

/**
 * 清除提示列表的key
 */
export function clearDeduplicationOptionKey () {
  console.log(1)
  deduplicationOptionKey = []
}

/**
 * 过滤掉已包含在提示列表里的数据
 * @param {T[]} options
 * @returns {T[]}
 * @constructor
 */
export function deduplicationHintOptions<T extends {value?: string, label?:string, [key: string]: any}> (options: T[] ): T[] {
  return options?.filter(item => !deduplicationOptionKey.includes(item.value ?? item.label ?? '')) ?? []
}


export function pipelineHint(_props: Parameters<hintPipelineLogic>[0], ...arg:hintPipelineLogic[]) {
  clearDeduplicationOptionKey()
  let completion = null
  let props = _props
  for (let i = 0; i < arg.length; i++) {
    const logic = arg[i]
    const data = logic?.(props)
    if (data?.state === 'end') {
      completion = data.data
      break
    } else if (data?.state === 'pipe') {
      props = data.data
    }
  }
  return completion
}


export function useObserveHintClose (dom?: HTMLDivElement | null) {
  const showed = useRef(false)
  useEffect(() => {
    const observer = new MutationObserver((mutationsList, observer) => {
      const _dom = dom?.querySelector(".cm-tooltip-autocomplete")

      console.log('change ob', _dom, dom?.querySelector('#a')?.querySelector(".cm-tooltip-autocomplete"))
      if (_dom && !showed.current) {
        showed.current = true
      }
      if (!_dom && showed.current) {

        showed.current = false
        clearDeduplicationOptionKey()
      }
    });
    if (dom) {
      observer.observe(dom, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect()
    }
    // dom.
  }, [dom])
}

/**
 * 当前行获取光标之前所有的word数据
 * @param {CompletionContext} context
 * @returns {{from: number, to: number, text: string} | null}
 */
export function getBeforeWord (context: CompletionContext) {
  return context.matchBefore(/.*/g)
}

export function pipelineReturnParams (data: hintPipelineLogicEndData, state: 'end'): hintPipelineLogicEnd
export function pipelineReturnParams (data: hintPipelineLogicProps, state: 'pipe'): hintPipelineLogicPipe
export function pipelineReturnParams (data: hintPipelineLogicProps | hintPipelineLogicEndData, state: 'pipe' | 'end'): hintPipelineLogicPipe | hintPipelineLogicEnd {
  return {
    state,
    data
  } as any
}
