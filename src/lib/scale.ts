export interface Config {
  minVw: number
  maxVw: number
  /** tamanho base (step 0) em px no viewport mínimo / máximo */
  minBase: number
  maxBase: number
  minRatio: number
  maxRatio: number
  stepsDown: number
  stepsUp: number
}

export interface Step {
  step: number
  name: string
  minPx: number
  maxPx: number
  clamp: string
}

export const RATIOS: [string, number][] = [
  ['Segunda menor · 1.067', 1.067],
  ['Segunda maior · 1.125', 1.125],
  ['Terça menor · 1.2', 1.2],
  ['Terça maior · 1.25', 1.25],
  ['Quarta perfeita · 1.333', 1.333],
  ['Quarta aumentada · 1.414', 1.414],
  ['Quinta perfeita · 1.5', 1.5],
]

const round = (n: number, d = 4) => parseFloat(n.toFixed(d))

/** Tamanho em px para um viewport, interpolando linearmente entre min e max (com travas). */
export function valueAt(minPx: number, maxPx: number, minVw: number, maxVw: number, vw: number): number {
  if (maxVw <= minVw) return minPx
  const t = Math.min(1, Math.max(0, (vw - minVw) / (maxVw - minVw)))
  return minPx + (maxPx - minPx) * t
}

/** clamp() CSS que interpola entre minPx (em minVw) e maxPx (em maxVw). */
export function fluidClamp(minPx: number, maxPx: number, minVw: number, maxVw: number): string {
  const minRem = round(minPx / 16)
  const maxRem = round(maxPx / 16)
  if (minPx === maxPx || maxVw <= minVw) return `${minRem}rem`

  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = round((minPx - slope * minVw) / 16)
  const vw = round(slope * 100)
  const lo = Math.min(minRem, maxRem)
  const hi = Math.max(minRem, maxRem)
  return `clamp(${lo}rem, ${intercept}rem + ${vw}vw, ${hi}rem)`
}

export function buildScale(c: Config): Step[] {
  const out: Step[] = []
  for (let s = -c.stepsDown; s <= c.stepsUp; s++) {
    const minPx = round(c.minBase * Math.pow(c.minRatio, s), 2)
    const maxPx = round(c.maxBase * Math.pow(c.maxRatio, s), 2)
    out.push({ step: s, name: `--step-${s}`, minPx, maxPx, clamp: fluidClamp(minPx, maxPx, c.minVw, c.maxVw) })
  }
  return out
}

export function toCss(steps: Step[]): string {
  return `:root {\n${steps.map((s) => `  ${s.name}: ${s.clamp};`).join('\n')}\n}\n`
}

export function toJson(steps: Step[]): string {
  return JSON.stringify(Object.fromEntries(steps.map((s) => [s.name.slice(2), s.clamp])), null, 2)
}
