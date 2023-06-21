import React from 'react'
import { CompletionsType, FunctionCompletionsType } from './editor'
import { CompletionsTypeEnum } from './editor/interface'
import { fieldAddTemplate } from './utils'


export const FieldDataList = (function () {
  const tree: any[] = [
    { type: CompletionsTypeEnum.OBJECT, returnType: 'string' ,label: '用户对象', value: 'user', style: 'color: red', className: 'user-name', children: [
        {type: CompletionsTypeEnum.OBJECT ,returnType: 'string', label: '用户1', value: 'user1', style: 'color: red', className: 'user-name', children: [
            {
              type: CompletionsTypeEnum.OBJECT ,returnType: 'string',label: '用户1头像', value: 'user1-header', style: 'color: red', className: 'user-name', children: []
            },{
              type: CompletionsTypeEnum.OBJECT ,returnType: 'number',label: '用户1年龄', value: 'user1-age', style: 'color: red', className: 'user-name', children: []
            }
          ]},
        {type: CompletionsTypeEnum.OBJECT ,returnType: 'string',label: '用户2', value: 'user2', style: 'color: red', className: 'user-name', children: []},
        {type: CompletionsTypeEnum.OBJECT ,returnType: 'string',label: '用户3', value: 'user2', style: 'color: red', className: 'user-name', children: []},
      ]},
    {type: CompletionsTypeEnum.OBJECT, returnType: 'number', label: 'ss对象', value: 'ssobj', detail: 'ss对象: number'},
    {type: CompletionsTypeEnum.OBJECT, returnType: 'number', label: 'ss2树对象', value: 'ssobj2', detail: 'ss对象: number'},
    { type: CompletionsTypeEnum.OBJECT ,returnType: 'string', label: '创建人', value: 'creatUser', detail: 'ss对象: number' },
    { type: CompletionsTypeEnum.OBJECT ,returnType: 'time', label: '修改时间', value: 'setTime', detail: 'ss对象: number' },
    { type: CompletionsTypeEnum.TABLE_OBJECT ,returnType: 'undefined', label: '表对象', value: 'tableOBject', detail: '表对象', children: [
        {type: CompletionsTypeEnum.OBJECT, returnType: 'number', label: '表对象数字字段', value: 'tableOBject-1', detail: '表对象数字字段: number'},
        {type: CompletionsTypeEnum.OBJECT, returnType: 'string', label: '表对象字符串字段', value: 'tableOBject-2', detail: '表对象字符串字段: number'},
      ]},
  ]
  fieldAddTemplate(tree)
  return tree
})()

export const functionCompletions: FunctionCompletionsType[] = [
  // {
  //   type: CompletionsTypeEnum.FUNCTION,
  //   label: 'table',
  //   template: 'table($\\{user\\}, ${t2})',
  //   paramsType: {
  //     length: 2,
  //     types: ['table', 'number']
  //   },
  //   returnType: 'number',
  //   detail: '求和函数，把所有参数加一起返回',
  // },
  {
    type: CompletionsTypeEnum.FUNCTION,
    label: 'table',
    template: 'table(${user}, @{t2})',
    paramsType: {
      length: 2,
      types: ['table', 'number']
    },
    returnType: 'number',
    detail: '求和函数，把所有参数加一起返回',
  },
  {
    type: CompletionsTypeEnum.FUNCTION,
    label: 'sum',
    template: 'sum(@{user}, @{num2}, @{num3}, @{...})',
    paramsType: {
      length: -1,
      types: ['number']
    },
    returnType: 'number',
    detail: '求和函数，把所有参数加一起返回',
  },
  {
    type: CompletionsTypeEnum.FUNCTION,
    label: 'text',
    template: 'text(@{num1})',
    paramsType: {
      length: 1,
      types: ['number']
    },
    returnType: 'string',
    detail: '函数可以将数字转为文本',
  }, {
    type: CompletionsTypeEnum.FUNCTION,
    label: 'str',
    template: 'str(@{s})',
    paramsType: {
      length: 1,
      types: ['string']
    },
    returnType: 'string',
    detail: '函数可以将值转为文本',
  }, {
    type: CompletionsTypeEnum.FUNCTION,
    label: 'string.length',
    template: 'string.length(@{s})',
    paramsType: {
      length: 1,
      types: ['string']
    },
    returnType: 'Long',
    detail: '求字符串长度，返回Long类型',
  },
]

export const operatorCompletions: CompletionsType[] = [
  {
    type: CompletionsTypeEnum.OPERATOR,
    label: '/',
    template: '/ ',
    detail: '除',
  },
  {
    type: CompletionsTypeEnum.OPERATOR,
    label: '+',
    template: '+ ',
    detail: '加',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '-',
    template: '- ',
    detail: '减',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '=',
    template: '= ',
    detail: '等于',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '!=',
    template: '!= ',
    detail: '不等于',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '>=',
    template: '>= ',
    detail: '大等于',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '||',
    template: '|| ',
    detail: '或',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '!',
    template: '! ',
    detail: '非',
  },{
    type: CompletionsTypeEnum.OPERATOR,
    label: '=~',
    template: '=~ ',
    detail: '匹配',
  },
]
