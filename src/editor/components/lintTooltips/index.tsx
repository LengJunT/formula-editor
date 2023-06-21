import React, { useEffect, useState } from 'react'
import { Diagnostic } from '../../codermirror/lint'
import { useEditorStore } from '../../store'

const LintTooltipsAttrKey = 'data-diagnostic'
const LintTooltipsOfObjAttrKey = 'data-obj-diagnostic'

export {
  LintTooltipsAttrKey,
  LintTooltipsOfObjAttrKey
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
    if (target && (target.hasAttribute(LintTooltipsAttrKey) || target.hasAttribute(LintTooltipsOfObjAttrKey) || (target.parentNode as HTMLElement)?.hasAttribute?.(LintTooltipsAttrKey)) || (target.parentNode as HTMLElement)?.hasAttribute?.(LintTooltipsOfObjAttrKey)) {
      const _v = target.getAttribute(LintTooltipsAttrKey) ?? (target.parentNode as HTMLElement)?.getAttribute(LintTooltipsAttrKey)
      const __v = target.getAttribute(LintTooltipsOfObjAttrKey) ?? (target.parentNode as HTMLElement)?.getAttribute(LintTooltipsOfObjAttrKey)
      if (_v) {
        try {
          const data = JSON.parse(_v)
          handleState(target, data)
        } catch (e) {}
      } else  if (__v) {
        const lintDiagnostics = useEditorStore.getState().lintDiagnostics
        const data = lintDiagnostics.find(item => item.type === 4)?.data
        const diagnostic = data?.find(item => item.source === __v)
        if (diagnostic) {
          handleState(target, diagnostic)
        }
      }
    }
  }
  const handleMouseout = (e: any) => {
    // console.log('handleMouseout', e)
    const target = e.target as HTMLElement
    if (target && (target.hasAttribute(LintTooltipsAttrKey) || target.hasAttribute(LintTooltipsOfObjAttrKey) || (target.parentNode as HTMLElement)?.hasAttribute?.(LintTooltipsAttrKey)) || (target.parentNode as HTMLElement)?.hasAttribute?.(LintTooltipsOfObjAttrKey)) {
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
