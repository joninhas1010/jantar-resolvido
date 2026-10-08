const STORAGE_KEY = 'jantar-resolvido-state'

export type AppState = {
  dataInicio: string | null
  jantaresFeitos: number[]
  trocas: Record<number, string>
}

const defaultState: AppState = {
  dataInicio: null,
  jantaresFeitos: [],
  trocas: {},
}

function canUseStorage(): boolean {
  try {
    localStorage.setItem('__test__', '1')
    localStorage.removeItem('__test__')
    return true
  } catch {
    return false
  }
}

export function loadState(): AppState {
  if (!canUseStorage()) return { ...defaultState }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return { ...defaultState }
  }
}

export function saveState(state: AppState): void {
  if (!canUseStorage()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* silently fail */ }
}

export function getDiaDoPlan(dataInicio: string): number {
  const inicio = new Date(dataInicio + 'T00:00:00')
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diff = Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
}
