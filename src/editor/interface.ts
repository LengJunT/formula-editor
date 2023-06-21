import { Diagnostic } from './codermirror/lint'

export interface EditorRefs {
  insertText?: (text: string, isTemplate: boolean) => void;
  clearText?: () => void;
  setText?: (text: string) => void;
}

export enum CompletionsTypeEnum {
  FUNCTION = 'function',
  OPERATOR = 'operator',
  OBJECT = 'object',
  TABLE_OBJECT = 'tableObject'
}



/**
 * 提示的优先级排序
 */
export enum HintBoots {
  context= 90,
  /**
   * 对象
   * */
  object = 80,
  /**
   * 子对象路由
   * @type {HintBoots.objectSubRouter}
   */
  objectSubRouter = 81,
  /**
   * 对象字段
   * @type {HintBoots.field}
   */
  field = 70,
  /**
   * 主数据
   * @type {HintBoots.masterData}
   */
  masterData= 60,
  /**
   * 旧版主数据
   * @type {HintBoots.masterData}
   */
  masterDataOld= 61,
  /**
   * 函数
   * @type {HintBoots.masterData}
   */
  function = 50,
  /**
   * 系统参数(对象类型)
   * @type {HintBoots.parameterObject}
   */
  parameterObject = 40,
  /**
   * 系统参数(字段类型)
   * @type {HintBoots.parameterField}
   */
  parameterField = 41,
  /**
   * 表对象
   * @type {HintBoots.tableObject}
   */
  tableObject = 42,
  /**
   * 操作符
   * @type {HintBoots.operator}
   */
  operator = 30,
  /**
   * 职能
   * @type {HintBoots.functions}
   */
  functions = 20,
  /**
   * 角色
   * @type {HintBoots.Role}
   */
  Role= 21,
  /**
   * ipaas 接口函数节点网
   * @type {HintBoots.ipaas}
   */
  ipaas= 22,
}

export const BootsMap = {
  [CompletionsTypeEnum.OBJECT]: HintBoots.object,
  [CompletionsTypeEnum.FUNCTION]: HintBoots.function,
  [CompletionsTypeEnum.OPERATOR]: HintBoots.operator,
  [CompletionsTypeEnum.TABLE_OBJECT]: HintBoots.tableObject,
}

export interface CompletionsType {
  template: string;
  label: string;
  detail: string;
  type: CompletionsTypeEnum;
  // returnType: Types
  // children?: CompletionsType[]
  // value: string
  boost?: number | HintBoots
  // style?: any
  // className?: string
}

type Types = 'number' | 'string' | 'boolean' | 'null' | 'Long' | 'time' | 'table'

export interface FunctionCompletionsType extends CompletionsType {
  handle?: any;
  paramsType: {
    length: number
    types: Types[]
  }
  returnType: Types
}

export interface HintPathType {
  label: string;
  detail: string;
  type: 'function' | 'keyword' | 'variable' | 'text' | 'property';
  template: string;
  children?: HintPathType[];
}

/*
快速匹配map，
 */
export type QuickMatchMap = Record<string, any>


export interface Hotkey {
  openSearch: string
  save: string
  copy: string
  cut: string
  paste: string
}

export const defaultHotkey: Hotkey = {
  openSearch: 'Mod-f',
  save: 'Mod-s',
  copy: 'Mod-c',
  cut: 'Mod-x',
  paste: 'Mod-v'
}


export type EditDiagnostics = {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7
  data: Diagnostic[]
}[]
