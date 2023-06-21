import { ViewUpdate } from '@codemirror/view';
import { DecorationSet } from '@codemirror/view';
import {
  Decoration,
  ViewPlugin,
  MatchDecorator,
  EditorView,
  WidgetType,
} from '@codemirror/view';
import ReactDOM from 'react-dom/client'
import { Popover } from 'antd'
import TooltipCard from '../components/tooltipCard'
import { TOOLTIP_KEY } from '../components/hoverTooltips'
import { QuickMatchMap } from '../interface'
import { useEditorStore } from '../store'
import { LintTooltipsAttrKey, LintTooltipsOfObjAttrKey } from '../components/lintTooltips'

export type GetPlaceholderInfo = (text: string) => {
  /**
   * 标签渲染文本
   */
  label: string
  className?: string
  style?: string
  value: string
}[] | undefined

export const placeholdersPlugin = (quickMatchMap: QuickMatchMap, deletedPlaceholders: string[]) => {

  class PlaceholderWidget extends WidgetType {
    text: string
    constructor(text: string) {
      super();
      this.text = text
    }

    eq(other: PlaceholderWidget) {
      return this.text == other.text;
    }

    toDOM() {
      let elt = document.createElement('span');
      if (!this.text) return elt;
      console.log('toDOM')
      console.log(1, this.text)
      const config = this.text.split('.').map(key => quickMatchMap[key]).filter(i => !!i)
      let root = document.createElement('span');

      if (config?.length) {
        const cur = config[config.length - 1]
        const { className, style } = cur
        const labels = config.map(item => item.label)
        elt.textContent = labels.join('.');
        if (className) elt.classList.add(className)
        if (style) elt.style.cssText = style
        elt.className = 'cm-field-var-widget'
        const lintDiagnostics = useEditorStore.getState().lintDiagnostics
        const data = lintDiagnostics.find(item => item.type === 4)?.data
        const diagnostic = data?.find(item => item.source === cur.value)
        if (diagnostic) {
          root.className = 'cm-lintRange cm-lintRange-error'
          root.setAttribute(LintTooltipsAttrKey, JSON.stringify(diagnostic))
          root.append(elt)
          return root
        } else if (deletedPlaceholders.includes(cur.value)) {
          root.className = 'cm-lintRange cm-lintRange-error'
          root.setAttribute(LintTooltipsOfObjAttrKey, cur.value)
          root.append(elt)
          return root
        } else {
          elt.setAttribute(TOOLTIP_KEY.KEY, 'placeholder')
          elt.setAttribute(TOOLTIP_KEY.VALUE, this.text)
        }
      } else {
        elt.className = 'cm-field-var-widget'
        elt.textContent = this.text;
        elt.setAttribute(TOOLTIP_KEY.KEY, 'placeholder')
        elt.setAttribute(TOOLTIP_KEY.VALUE, this.text)
      }
      return elt

    }
    ignoreEvent(event:Event) {
      // console.log('ignoreEvent', event)
      // if (event.type === 'mousemove' || event.type === 'mouseout') {
      //   return  false
      // }
      return true;
    }
  }

  const placeholderMatcher = new MatchDecorator({
    // regexp: /\[\[(.+?)\]\]/g,
    regexp: /\${(.*?)}/g,
    decoration: (match) => {
      return Decoration.replace({
        widget: new PlaceholderWidget(match[1]),
      });
    },
  });

  return ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(
          update,
          this.placeholders
        );
      }
    },
    {
      decorations: (instance: any) => {
        return instance.placeholders;
      },
      provide: (plugin: any) =>
        EditorView.atomicRanges.of((view: any) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    }
  );
}




