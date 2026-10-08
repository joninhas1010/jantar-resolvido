import { describe, it, expect } from 'vitest'
import { getDiaDoPlan } from '../store'

describe('getDiaDoPlan', () => {
  it('returns 1 on the start date itself', () => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataInicio = hoje.toISOString().slice(0, 10)
    expect(getDiaDoPlan(dataInicio)).toBe(1)
  })

  it('returns 2 one day after start', () => {
    const ontem = new Date()
    ontem.setDate(ontem.getDate() - 1)
    ontem.setHours(0, 0, 0, 0)
    const dataInicio = ontem.toISOString().slice(0, 10)
    expect(getDiaDoPlan(dataInicio)).toBe(2)
  })

  it('returns 30 when 29 days have passed', () => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    d.setHours(0, 0, 0, 0)
    const dataInicio = d.toISOString().slice(0, 10)
    expect(getDiaDoPlan(dataInicio)).toBe(30)
  })

  it('returns a value > 30 if more than 30 days passed', () => {
    const d = new Date()
    d.setDate(d.getDate() - 35)
    d.setHours(0, 0, 0, 0)
    const dataInicio = d.toISOString().slice(0, 10)
    expect(getDiaDoPlan(dataInicio)).toBeGreaterThan(30)
  })
})
