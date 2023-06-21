import React from 'react'
import { FieldListInfo } from '../../../panel'


const TooltipCard = (props: {
  value: string,
  type: 'field' | 'function' | 'operator'
}) => {
  const { type, value } = props
  if (type === 'field') {
    const info = FieldListInfo[value]
    if (info) {
      const { name, type, id, code } = info
      return <div className={'cm-tooltip-card'}>
        <div>{name}</div>
        <div>对象类型：{type}</div>
        <div>ID：{id}</div>
        <div>API Code：{ code}</div>
      </div>
    }
    return null
  } else if (type === 'operator') {
    return <div>操作符 - {value}</div>
  }
  return <div>函数 - {value}</div>
}

export default React.memo(TooltipCard)
