import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { loadState, saveState, getDiaDoPlan, AppState } from '../store'
import { receitasPrincipais } from '../content/receitas-principais'
import { Receita } from '../types'

type AppContextType = {
  state: AppState
  diaDoPlan: number
  getReceitaDoDia: (dia: number) => Receita | undefined
  marcarFeito: (dia: number) => void
  desmarcarFeito: (dia: number) => void
  trocarDias: (diaA: number, diaB: number) => void
  restaurarSequencia: () => void
  setDataInicio: (data: string) => void
  itensMarcadosCompras: Record<string, boolean>
  toggleItemCompra: (key: string) => void
  limparMarcasCompras: (semana: number) => void
  itensExtras: string[]
  addItemExtra: (item: string) => void
  removeItemExtra: (item: string) => void
  ultimaTroca: { diaA: number; diaB: number } | null
  desfazerTroca: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const [itensMarcados, setItensMarcados] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('jr-compras-marcados')
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })
  const [itensExtras, setItensExtras] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('jr-compras-extras')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [ultimaTroca, setUltimaTroca] = useState<{ diaA: number; diaB: number } | null>(null)

  useEffect(() => { saveState(state) }, [state])
  useEffect(() => {
    try { localStorage.setItem('jr-compras-marcados', JSON.stringify(itensMarcados)) } catch {}
  }, [itensMarcados])
  useEffect(() => {
    try { localStorage.setItem('jr-compras-extras', JSON.stringify(itensExtras)) } catch {}
  }, [itensExtras])

  const diaDoPlan = state.dataInicio ? getDiaDoPlan(state.dataInicio) : 12

  const getReceitaDoDia = useCallback((dia: number): Receita | undefined => {
    const receitaId = state.trocas[dia]
    if (receitaId) return receitasPrincipais.find(r => r.id === receitaId)
    return receitasPrincipais.find(r => r.diaPadrao === dia)
  }, [state.trocas])

  const marcarFeito = useCallback((dia: number) => {
    setState(s => ({
      ...s,
      jantaresFeitos: s.jantaresFeitos.includes(dia) ? s.jantaresFeitos : [...s.jantaresFeitos, dia],
    }))
  }, [])

  const desmarcarFeito = useCallback((dia: number) => {
    setState(s => ({
      ...s,
      jantaresFeitos: s.jantaresFeitos.filter(d => d !== dia),
    }))
  }, [])

  const trocarDias = useCallback((diaA: number, diaB: number) => {
    setState(s => {
      const receitaA = s.trocas[diaA] || receitasPrincipais.find(r => r.diaPadrao === diaA)?.id
      const receitaB = s.trocas[diaB] || receitasPrincipais.find(r => r.diaPadrao === diaB)?.id
      const novasTrocas = { ...s.trocas }
      if (receitaB) novasTrocas[diaA] = receitaB
      if (receitaA) novasTrocas[diaB] = receitaA
      return { ...s, trocas: novasTrocas }
    })
    setUltimaTroca({ diaA, diaB })
  }, [])

  const desfazerTroca = useCallback(() => {
    if (!ultimaTroca) return
    const { diaA, diaB } = ultimaTroca
    setState(s => {
      const receitaA = s.trocas[diaA] || receitasPrincipais.find(r => r.diaPadrao === diaA)?.id
      const receitaB = s.trocas[diaB] || receitasPrincipais.find(r => r.diaPadrao === diaB)?.id
      const novasTrocas = { ...s.trocas }
      if (receitaB) novasTrocas[diaA] = receitaB
      if (receitaA) novasTrocas[diaB] = receitaA
      return { ...s, trocas: novasTrocas }
    })
    setUltimaTroca(null)
  }, [ultimaTroca])

  const restaurarSequencia = useCallback(() => {
    setState(s => ({ ...s, trocas: {} }))
    setUltimaTroca(null)
  }, [])

  const setDataInicio = useCallback((data: string) => {
    setState(s => ({ ...s, dataInicio: data }))
  }, [])

  const toggleItemCompra = useCallback((key: string) => {
    setItensMarcados(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const limparMarcasCompras = useCallback((_semana: number) => {
    setItensMarcados({})
  }, [])

  const addItemExtra = useCallback((item: string) => {
    setItensExtras(prev => prev.includes(item) ? prev : [...prev, item])
  }, [])

  const removeItemExtra = useCallback((item: string) => {
    setItensExtras(prev => prev.filter(i => i !== item))
  }, [])

  return (
    <AppContext.Provider value={{
      state, diaDoPlan, getReceitaDoDia,
      marcarFeito, desmarcarFeito,
      trocarDias, restaurarSequencia, setDataInicio,
      itensMarcadosCompras: itensMarcados, toggleItemCompra, limparMarcasCompras,
      itensExtras, addItemExtra, removeItemExtra,
      ultimaTroca, desfazerTroca,
    }}>
      {children}
    </AppContext.Provider>
  )
}
