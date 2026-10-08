import { describe, it, expect } from 'vitest'
import { getSemana, getDiasDaSemana, gerarListaCompras, agruparPorCategoria } from './listaCompras'
import { Receita } from '../types'

describe('getSemana', () => {
  it('dias 1-7 belong to semana 1', () => {
    for (let d = 1; d <= 7; d++) {
      expect(getSemana(d)).toBe(1)
    }
  })

  it('dias 8-14 belong to semana 2', () => {
    for (let d = 8; d <= 14; d++) {
      expect(getSemana(d)).toBe(2)
    }
  })

  it('dias 15-21 belong to semana 3', () => {
    expect(getSemana(15)).toBe(3)
    expect(getSemana(21)).toBe(3)
  })

  it('dias 22-28 belong to semana 4', () => {
    expect(getSemana(22)).toBe(4)
    expect(getSemana(28)).toBe(4)
  })

  it('dias 29-30 belong to semana 5 (finais)', () => {
    expect(getSemana(29)).toBe(5)
    expect(getSemana(30)).toBe(5)
  })
})

describe('getDiasDaSemana', () => {
  it('semana 1 returns days 1-7', () => {
    expect(getDiasDaSemana(1)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('semana 2 returns days 8-14', () => {
    expect(getDiasDaSemana(2)).toEqual([8, 9, 10, 11, 12, 13, 14])
  })

  it('semana 5 returns days 29-30', () => {
    expect(getDiasDaSemana(5)).toEqual([29, 30])
  })
})

describe('gerarListaCompras', () => {
  const receitaFake: Receita = {
    id: 'test-01',
    tipo: 'principal',
    diaPadrao: 1,
    nome: 'Receita teste',
    tempoTotalMin: 15,
    porcoes: 4,
    ingredientes: [
      { nome: 'Ovo', quantidade: 4, unidade: 'unidades', categoria: 'Proteínas' },
      { nome: 'Sal', quantidade: null, unidade: '', categoria: 'Temperos', observacao: 'a gosto' },
    ],
    passos: [{ texto: 'Faça algo.', ingredientes: ['Ovo'] }],
    substituicoes: [],
  }

  const receitaFake2: Receita = {
    id: 'test-02',
    tipo: 'principal',
    diaPadrao: 2,
    nome: 'Receita teste 2',
    tempoTotalMin: 15,
    porcoes: 4,
    ingredientes: [
      { nome: 'Ovo', quantidade: 2, unidade: 'unidades', categoria: 'Proteínas' },
      { nome: 'Cenoura', quantidade: 1, unidade: 'unidade', categoria: 'Legumes e verduras' },
    ],
    passos: [{ texto: 'Faça algo.', ingredientes: ['Ovo'] }],
    substituicoes: [],
  }

  it('aggregates same ingredient across days', () => {
    const getReceita = (dia: number) => {
      if (dia === 1) return receitaFake
      if (dia === 2) return receitaFake2
      return undefined
    }

    const lista = gerarListaCompras(1, getReceita)
    const ovo = lista.find(i => i.nome === 'Ovo')

    expect(ovo).toBeDefined()
    expect(ovo!.quantidade).toBe(6)
    expect(ovo!.dias).toContain(1)
    expect(ovo!.dias).toContain(2)
  })

  it('keeps null-quantity items as null', () => {
    const getReceita = (dia: number) => (dia === 1 ? receitaFake : undefined)
    const lista = gerarListaCompras(1, getReceita)
    const sal = lista.find(i => i.nome === 'Sal')

    expect(sal).toBeDefined()
    expect(sal!.quantidade).toBeNull()
  })

  it('returns empty for a week with no recipes', () => {
    const lista = gerarListaCompras(1, () => undefined)
    expect(lista).toEqual([])
  })
})

describe('agruparPorCategoria', () => {
  it('groups items by their category', () => {
    const itens = [
      { nome: 'Ovo', quantidade: 4, unidade: 'unidades', categoria: 'Proteínas' as const, dias: [1], key: 'k1' },
      { nome: 'Sal', quantidade: null, unidade: '', categoria: 'Temperos' as const, dias: [1], key: 'k2' },
      { nome: 'Cenoura', quantidade: 1, unidade: 'unidade', categoria: 'Legumes e verduras' as const, dias: [1], key: 'k3' },
    ]

    const grupos = agruparPorCategoria(itens)
    expect(grupos).toHaveLength(3)
    expect(grupos[0].categoria).toBe('Proteínas')
    expect(grupos[1].categoria).toBe('Legumes e verduras')
    expect(grupos[2].categoria).toBe('Temperos')
  })

  it('omits empty categories', () => {
    const itens = [
      { nome: 'Ovo', quantidade: 4, unidade: 'unidades', categoria: 'Proteínas' as const, dias: [1], key: 'k1' },
    ]

    const grupos = agruparPorCategoria(itens)
    expect(grupos).toHaveLength(1)
    expect(grupos[0].categoria).toBe('Proteínas')
  })
})
