import { Receita, Categoria, Ingrediente } from '../types'

export type ItemCompra = {
  nome: string
  quantidade: number | null
  unidade: string
  categoria: Categoria
  dias: number[]
  key: string
}

export function getSemana(dia: number): number {
  if (dia >= 29) return 5
  return Math.ceil(dia / 7)
}

export function getDiasDaSemana(semana: number): number[] {
  if (semana === 5) return [29, 30]
  const inicio = (semana - 1) * 7 + 1
  return Array.from({ length: 7 }, (_, i) => inicio + i)
}

export function getLabelSemana(semana: number): string {
  if (semana === 5) return 'Dias finais'
  return `Semana ${semana}`
}

export function getDescSemana(semana: number): string {
  if (semana === 5) return 'Dias 29 e 30'
  const inicio = (semana - 1) * 7 + 1
  const fim = semana * 7
  return `Dias ${inicio} a ${fim}`
}

export function gerarListaCompras(
  semana: number,
  getReceitaDoDia: (dia: number) => Receita | undefined,
): ItemCompra[] {
  const dias = getDiasDaSemana(semana)
  const mapa = new Map<string, ItemCompra>()

  for (const dia of dias) {
    const receita = getReceitaDoDia(dia)
    if (!receita) continue

    for (const ing of receita.ingredientes) {
      const chave = `${ing.nome}|${ing.unidade}`
      const existente = mapa.get(chave)

      if (existente) {
        if (existente.quantidade !== null && ing.quantidade !== null) {
          existente.quantidade += ing.quantidade
        }
        if (!existente.dias.includes(dia)) {
          existente.dias.push(dia)
        }
      } else {
        mapa.set(chave, {
          nome: ing.nome,
          quantidade: ing.quantidade,
          unidade: ing.unidade,
          categoria: ing.categoria,
          dias: [dia],
          key: `s${semana}-${chave}`,
        })
      }
    }
  }

  return Array.from(mapa.values())
}

const ORDEM_CATEGORIAS: Categoria[] = [
  'Proteínas',
  'Legumes e verduras',
  'Grãos e acompanhamentos',
  'Temperos',
  'Outros',
]

export function agruparPorCategoria(itens: ItemCompra[]): { categoria: Categoria; itens: ItemCompra[] }[] {
  return ORDEM_CATEGORIAS
    .map(cat => ({
      categoria: cat,
      itens: itens.filter(i => i.categoria === cat),
    }))
    .filter(g => g.itens.length > 0)
}

export function formatarListaTexto(
  itens: ItemCompra[],
  semana: number,
  marcados: Record<string, boolean>,
): string {
  const grupos = agruparPorCategoria(itens)
  let texto = `🛒 Lista de compras - ${getLabelSemana(semana)} (${getDescSemana(semana)})\n\n`

  for (const { categoria, itens: catItens } of grupos) {
    texto += `${categoria}\n`
    for (const item of catItens) {
      const check = marcados[item.key] ? '✓' : '○'
      const qtd = item.quantidade !== null ? `${item.quantidade} ${item.unidade}` : 'a gosto'
      texto += `${check} ${item.nome} — ${qtd}\n`
    }
    texto += '\n'
  }

  texto += 'Jantar Resolvido'
  return texto
}
