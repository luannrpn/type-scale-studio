import { describe, expect, it } from 'vitest'
import { buildScale, fluidClamp, toCss, valueAt, type Config } from './scale'

const cfg: Config = { minVw: 320, maxVw: 1440, minBase: 16, maxBase: 18, minRatio: 1.2, maxRatio: 1.25, stepsDown: 2, stepsUp: 3 }

describe('scale', () => {
  it('gera clamp com interceptação e inclinação corretas', () => {
    expect(fluidClamp(16, 18, 320, 1440)).toBe('clamp(1rem, 0.9643rem + 0.1786vw, 1.125rem)')
  })

  it('clamp interpola exatamente nas extremidades', () => {
    expect(valueAt(16, 18, 320, 1440, 320)).toBe(16)
    expect(valueAt(16, 18, 320, 1440, 1440)).toBe(18)
    expect(valueAt(16, 18, 320, 1440, 880)).toBeCloseTo(17)
    expect(valueAt(16, 18, 320, 1440, 100)).toBe(16)
    expect(valueAt(16, 18, 320, 1440, 3000)).toBe(18)
  })

  it('tamanho fixo vira rem simples', () => {
    expect(fluidClamp(16, 16, 320, 1440)).toBe('1rem')
  })

  it('escala que diminui mantém min <= max dentro do clamp', () => {
    expect(fluidClamp(20, 16, 320, 1440)).toMatch(/^clamp\(1rem, .+, 1\.25rem\)$/)
  })

  it('intercepto negativo é escrito com sinal', () => {
    expect(fluidClamp(10, 100, 320, 1440)).toContain('-0.')
  })

  it('constrói steps de -stepsDown até stepsUp', () => {
    const s = buildScale(cfg)
    expect(s).toHaveLength(6)
    expect(s[0].step).toBe(-2)
    expect(s[2].step).toBe(0)
    expect(s[2].minPx).toBe(16)
    expect(s[2].maxPx).toBe(18)
    expect(s[3].minPx).toBeCloseTo(19.2, 2)
    expect(s[3].maxPx).toBeCloseTo(22.5, 2)
  })

  it('exporta CSS com variáveis', () => {
    const css = toCss(buildScale(cfg))
    expect(css).toContain('--step-0: clamp(')
    expect(css.startsWith(':root {')).toBe(true)
  })
})
