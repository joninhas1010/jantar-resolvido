export type Categoria = 'Proteínas' | 'Legumes e verduras' | 'Grãos e acompanhamentos' | 'Temperos' | 'Outros'

export type Ingrediente = {
  nome: string
  quantidade: number | null
  unidade: string
  categoria: Categoria
  observacao?: string
}

export type Passo = {
  texto: string
  minutos?: number
  ingredientes?: string[]
}

export type Substituicao = {
  falta: string
  use: string
  observacao?: string
}

export type Receita = {
  id: string
  tipo: 'principal' | 'economico' | 'sos'
  diaPadrao?: number
  nome: string
  tempoTotalMin: number
  porcoes: number
  ingredientes: Ingrediente[]
  passos: Passo[]
  substituicoes: Substituicao[]
  foto?: string
  etiquetas?: string[]
}
