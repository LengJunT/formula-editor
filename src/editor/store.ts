import { create } from 'zustand'
import { EditDiagnostics, QuickMatchMap } from './interface'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'

interface UseEditorStore {
  quickMatchMap: QuickMatchMap
  setQuickMatchMap: (quickMatchMap: QuickMatchMap) => void
  searchCount: number
  searchCurIndex: number
  setSearchCountAndIndex: (idx: number, count: number) =>void
  lintDiagnostics: EditDiagnostics
  setLintDiagnostics: (lintDiagnostics: EditDiagnostics) => void
}

export const useEditorStore = create<UseEditorStore>((set) => {
  return {
    quickMatchMap: {},
    setQuickMatchMap: (quickMatchMap) => set({quickMatchMap}),
    searchCount: 0,
    searchCurIndex: 0,
    setSearchCountAndIndex: (index, count) => set({ searchCount: count, searchCurIndex: index}),
    lintDiagnostics: [],
    setLintDiagnostics: (lintDiagnostics: EditDiagnostics) => set({lintDiagnostics})
  }
})

let editor: ReactCodeMirrorRef

export const getEditor = () => editor

export const initEditor = (e?: ReactCodeMirrorRef) => {
  if (e) {
    editor = e
  }
}
