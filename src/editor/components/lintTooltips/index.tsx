import React, { useEffect, useState } from 'react'
import { Diagnostic } from '../../codermirror/lint'

const LintTooltipsAttrKey = 'data-diagnostic'

export {
  LintTooltipsAttrKey
}

const LintTooltips = (props: {
  dom?: HTMLDivElement
}) => {
  const { dom } = props
  const [{x, y, diagnostic}, setState] = useState<{
    x?: number,
    y?: number,
    diagnostic?: Diagnostic
  }>({})

  const handleState = (target: HTMLElement, diagnostic?: Diagnostic) => {
    const { x, y, height } = target.getBoundingClientRect()
    setState({
      x, y: y+height, diagnostic
    })
  }

  const handleMouseover = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target && (target.hasAttribute(LintTooltipsAttrKey) || (target.parentNode as HTMLElement)?.hasAttribute?.(LintTooltipsAttrKey))) {
      const _v = target.getAttribute(LintTooltipsAttrKey) ?? (target.parentNode as HTMLElement)?.getAttribute(LintTooltipsAttrKey)
      if (_v) {
        try {
          const data = JSON.parse(_v)
          handleState(target, data)
        } catch (e) {}
      }
    }
  }
  const handleMouseout = (e: any) => {
    // console.log('handleMouseout', e)
    const target = e.target as HTMLElement
    if (target && (target.hasAttribute(LintTooltipsAttrKey) || (target.parentNode as HTMLElement)?.hasAttribute?.(LintTooltipsAttrKey))) {
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
  if (!(x && y && diagnostic)) return null
  const style: React.CSSProperties = {
    left: x,
    top: y,
    position: 'fixed'
  }
  return <div style={style} className={'cm-tooltip-card bg-white border border-solid border-cyan-400'}>
    {diagnostic.message}
  </div>
}

export default React.memo(LintTooltips)
