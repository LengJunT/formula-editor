import { search } from '@codemirror/search'
import { Panel, ViewUpdate, panels } from '@codemirror/view'
import { Search } from '../components/search'
import ReactDOM from 'react-dom/client'

export const panelsPlugin = (searchContainer: HTMLElement) => {
  return panels({
    topContainer: searchContainer
  })
}

export const searchPlugin = () => {
  return search({
    createPanel: (view): Panel => {
      const dom = document.createElement('div')
      const root = ReactDOM.createRoot(dom)
      root.render(<Search editorView={view} />);
      return {
        dom,
        mount () {
          console.log('search panel mount')
        },
        update (update: ViewUpdate) {
          console.log('search panel update')
        },
        destroy () {
          console.log('search panel destroy')
        },
        top: true
      }
    }
  })
}
