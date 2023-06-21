import React, { useEffect, useState } from 'react'
import { QuickMatchMap } from '../../interface'


const TooltipCard = (props: {
  value: string,
  type: 'field' | 'function' | 'operator' | 'keyword',
  x?: number
  y?: number
  quickMatchMap: QuickMatchMap
}) => {
  const { type, value, x, y ,quickMatchMap} = props
  if (x === undefined || y === undefined) return null
  const style: React.CSSProperties = {
    left: x,
    top: y,
    position: 'fixed'
  }
  if (type === 'field') {
    const values = value.split('.')
    const label = values.map(key => quickMatchMap[key]?.label).filter(i => !!i).join(' > ')
    const info = quickMatchMap[values[values.length - 1]]
    if (info) {
      const { name, type, id, code } = info
      return <div style={style} className={'cm-tooltip-card bg-white border border-solid border-cyan-400'}>
        <div>{label}</div>
        <div>对象类型：{type}</div>
        <div>ID：{id}</div>
        <div>API Code：{ code}</div>
      </div>
    }
    return null
  }
  return <div style={style} className={'cm-tooltip-card bg-white border border-solid border-cyan-400'}>{ type === 'operator' ? '操作符' : '函数' } - {value}</div>
}

export enum TOOLTIP_KEY {
  CLS_OPERATOR = 'cls-data-tooltip-operator',
  KEY = 'data-tooltip',
  VALUE = 'data-tooltip-value'
}

const HoverTooltips = (props: {
  dom?: HTMLDivElement
  quickMatchMap: QuickMatchMap
}) => {
  const { dom } = props
  const [{x, y, cardType, value}, setState] = useState<{
    x?: number,
    y?: number,
    cardType?: 'field' | 'function' | 'operator' | 'keyword',
    value?: string | null
  }>({})

  const handleState = (target: HTMLElement, type: any, value?: string | null) => {
    const { x, y, height } = target.getBoundingClientRect()
    setState({
      x, y: y+height, value: value, cardType: type
    })
  }

  const handleMouseover = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target && target.hasAttribute(TOOLTIP_KEY.KEY)) {
      const type = target.getAttribute(TOOLTIP_KEY.KEY)
      const _v = target.getAttribute(TOOLTIP_KEY.VALUE)
      const map: Record<string, any> = {
        'placeholder': 'field',
        'keyword': 'keyword',
        'operator': 'operator',
        'function': 'function'
      }
      const _t = type ? map[type] : undefined
      handleState(target, _t, _v)
    }
    // else if (target && target.classList.contains(TOOLTIP_KEY.CLS_OPERATOR)) {
    //   const value = target.textContent
    //   handleState(target, 'operator', value)
    // }
  }
  const handleMouseout = (e: any) => {
    // console.log('handleMouseout', e)
    const target = e.target as HTMLElement
    if (target && target.hasAttribute(TOOLTIP_KEY.KEY)) {
      setState({})
    } else if (target && target.classList.contains(TOOLTIP_KEY.CLS_OPERATOR)) {
      setState({})
    }
  }
  useEffect(() => {
    dom?.addEventListener('mouseover', handleMouseover)
    dom?.addEventListener('mouseout', handleMouseout)
    return () => {
      dom?.removeEventListener('mouseover', handleMouseover)
      dom?.removeEventListener('mouseout', handleMouseout)
    }
  }, [dom])
  if (!(cardType && value)) return null
  return <TooltipCard x={x} y={y} type={cardType} value={value} quickMatchMap={props.quickMatchMap} />
}

export default React.memo(HoverTooltips)
