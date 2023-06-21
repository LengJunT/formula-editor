import { HekitUiIcon, LIB } from '@hekit/hekit-icon'
import ReactDOM from 'react-dom/client'
import { hintGather } from './hint'
import { autocompletion, CompletionContext, CompletionSource, snippetCompletion } from '@codemirror/autocomplete';
import { CompletionsType, CompletionsTypeEnum, HintPathType, QuickMatchMap } from '../interface';
import { extractLabelNestedValues } from '../../utils'
import { coverSnippetCompletion } from '../codermirror'

function override(completions: CompletionsType[]): CompletionSource {
  return (context: CompletionContext) => {
    let word = context.matchBefore(/\w*/);
    if (!word || word && word.from == word.to && !context.explicit) return null;
    console.log('override', completions, word, context)
    return {
      from: word.from,
      options: completions?.map((item) => {
        const opt = {
          label: item.label,
          detail: item.detail,
          type: item.type,
        }
        if (!item.template) {
          return opt
        }
        return coverSnippetCompletion(item.template, opt)
      }) || [],
    };
  }
}

export function customCompletions ({
                                     completions,
                                     quickMatchMap
                                   }: {
  completions: CompletionsType[], hintPaths?: HintPathType[], quickMatchMap: QuickMatchMap
}) {
  // const _overrides: CompletionSource[] = [
  //   override([
  //     {
  //       template: 'SAAS',
  //       label: 'SAAS',
  //       detail: 'SAAS',
  //       type: CompletionsTypeEnum.OBJECT,
  //     }, {
  //       template: 'PAAS',
  //       label: 'PAAS',
  //       detail: 'PAAS',
  //       type: CompletionsTypeEnum.OBJECT
  //     }
  //   ]),
  //   override([...completions,{
  //     template: 'SAAS',
  //     label: 'SAAS',
  //     detail: 'SAAS',
  //     type: CompletionsTypeEnum.OBJECT,
  //   },]),
  //
  // ]
  // // if (hintPaths?.length) {
  // //   _overrides.push(hintPlugin(hintPaths, quickMatchMap))
  // // }
  // if (quickMatchMap) {
  //   _overrides.push(...hintGather(quickMatchMap))
  // }
  return autocompletion({
    override: hintGather(quickMatchMap, completions),
    tooltipClass: function (state) {
      return 'code-autocomplete-tooltip'
    },
    optionClass: function (state) {
      return 'code-autocomplete-tooltip-option'
    },
    closeOnBlur: false,
    icons: false,
    addToOptions: [
      {
        render: function (completion, state) {
          const { type } = completion
          const div = document.createElement('div')
          div.className = 'code-autocomplete-tooltip-option-icon'
          const Map: Record<string, string> = {
            [CompletionsTypeEnum.FUNCTION]: 'hanshu-gongshi',
            [CompletionsTypeEnum.OPERATOR]: 'yunsuanfu',
            [CompletionsTypeEnum.OBJECT]: 'duixiang-gongshi'
          }
          if (type && Map[type]) {
            const iconRoot = ReactDOM.createRoot(div)
            iconRoot.render(<HekitUiIcon type={Map[type]} lib={LIB.CPWEBICONS} />)
          } else {
            div.textContent = 'x'
          }
          return div
        },
        position: 20
      },
      // {
      //   render: function (completion) {
      //     const { label, type } = completion
      //     const div = document.createElement('div')
      //     div.className = 'code-autocomplete-tooltip-option-label'
      //     if (type === CompletionsTypeEnum.OBJECT) {
      //       const vars = extractLabelNestedValues(label)
      //       const labels = vars.map(key => quickMatchMap[key]?.label).filter(i => !!i)
      //       if (labels.length) {
      //         div.textContent = labels.join('.')
      //         return div
      //       }
      //     }
      //     div.textContent = label
      //     return div
      //   },
      //   position: 50
      // }
    ]
  })
}
