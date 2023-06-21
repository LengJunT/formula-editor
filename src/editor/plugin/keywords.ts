import {
  Decoration,
  ViewPlugin,
  MatchDecorator,
  EditorView,
  ViewUpdate,
  DecorationSet,
} from '@codemirror/view';
import { TOOLTIP_KEY } from '../components/hoverTooltips'

export const keywordsPlugin = (
  keywords: string[] = [],
  keywordsColor?: string,
  keywordsClassName?: string,
) => {

  const regexp = new RegExp(keywords.join('|'), 'g');

  const keywordsMatcher = new MatchDecorator({
    regexp,
    decoration: (match, view, pos) => {
      const lineText = view.state.doc.lineAt(pos).text;
      const [matchText] = match;

      // console.log('123', lineText, match, pos + matchText.length)
      // 如果当前匹配字段后面一位有值且不是空格的时候，这种情况不能算匹配到，不做处理
      if (lineText?.[pos + matchText.length] && lineText?.[pos + matchText.length] !== ' ') {
        // 如果关键字接括号，就是函数，也高亮
        if (lineText?.[pos + matchText.length] !== '(') {
          return Decoration.mark({});
        }
      }

      // 如果当前匹配字段前面一位有值且不是空格,小括号， 逗号的时候，这种情况不能算匹配到，不做处理
      if (lineText?.[pos - 1] && ![' ', '(', ','].includes(lineText?.[pos - 1])) {
        return Decoration.mark({});
      }


      let attributes: Record<string, string> = {}
      if (keywordsColor) {
        attributes.style = `color: ${keywordsColor};`;
      }

      return Decoration.mark({
        attributes: {
          ...attributes,
          [TOOLTIP_KEY.KEY]: 'keyword',
          [TOOLTIP_KEY.VALUE]: matchText
        },
        class: keywordsClassName,
      });
    },
  });

  return ViewPlugin.fromClass(
    class {
      keywords: DecorationSet;
      constructor(view: EditorView) {
        this.keywords = keywordsMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.keywords = keywordsMatcher.updateDeco(
          update,
          this.keywords
        );
      }
    },
    {
      decorations: (instance: any) => {
        return instance.keywords;
      }
    }
  );
}


