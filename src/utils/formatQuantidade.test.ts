import { describe, it, expect } from 'vitest'
import { formatQuantidade, scaleQuantidade } from './formatQuantidade'

describe('scaleQuantidade', () => {
  it('returns null for null base', () => {
    expect(scaleQuantidade(null, 4, 8)).toBeNull()
  })

  it('scales up correctly (4 -> 8 portions)', () => {
    expect(scaleQuantidade(500, 4, 8)).toBe(1000)
  })

  it('scales down correctly (4 -> 2 portions)', () => {
    expect(scaleQuantidade(500, 4, 2)).toBe(250)
  })

  it('keeps same value for same portions', () => {
    expect(scaleQuantidade(500, 4, 4)).toBe(500)
  })

  it('scales to 1 portion', () => {
    expect(scaleQuantidade(4, 4, 1)).toBe(1)
  })
})

describe('formatQuantidade', () => {
  it('formats null quantity as observacao', () => {
    expect(formatQuantidade(null, '', 'a gosto')).toBe('a gosto')
  })

  it('formats null quantity without observacao', () => {
    expect(formatQuantidade(null, '', undefined)).toBe('a gosto')
  })

  it('formats integer quantities', () => {
    expect(formatQuantidade(500, 'g')).toBe('500 g')
  })

  it('formats half fraction', () => {
    expect(formatQuantidade(0.5, 'xícara')).toBe('½ xícara')
  })

  it('formats mixed number with fraction', () => {
    expect(formatQuantidade(1.5, 'xícara')).toBe('1 ½ xícara')
  })

  it('formats quarter fraction', () => {
    expect(formatQuantidade(0.25, 'xícara')).toBe('¼ xícara')
  })

  it('formats decimal as fixed point when no fraction matches', () => {
    expect(formatQuantidade(2.15, 'xícara')).toBe('2.1 xícara')
  })

  it('formats without unit', () => {
    expect(formatQuantidade(4, '')).toBe('4')
  })
})
