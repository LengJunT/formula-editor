import { Decoration, DecorationSet, EditorView, MatchDecorator, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { TOOLTIP_KEY } from '../components/hoverTooltips'

function generateOperatorRegex(operators: string[]) {
  const escapedOperators = operators.map(operator => operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regexString = `(?<!\\S)(${escapedOperators.join('|')})(?!\\S)`;
  return new RegExp(regexString, 'g');
}


export const operatorKeyword = (operators: string[]) => {
  const regexp = generateOperatorRegex(operators)
  const operatorMatcher = new MatchDecorator({
    regexp,
    decoration: (match) => {
      console.log('operatorKeyword', match)
      const [matchText] = match;
      return Decoration.mark({
        attributes: {
          [TOOLTIP_KEY.KEY]: 'operator',
          [TOOLTIP_KEY.VALUE]: matchText,
          style: 'color:red',
        },
        // class: 'aaa'
      })
    }
  })
  return ViewPlugin.fromClass(
    class {
      operatorMatcher: DecorationSet
      constructor (view: EditorView) {
        this.operatorMatcher = operatorMatcher.createDeco(view)
      }
      update(update: ViewUpdate) {
        this.operatorMatcher = operatorMatcher.updateDeco(
          update,
          this.operatorMatcher
        )
      }
    }, {
      decorations: (instance) => {
        return instance.operatorMatcher
      }
    }
  )
}
