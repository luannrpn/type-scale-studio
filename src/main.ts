import '@fontsource-variable/instrument-sans'
import './styles/base.css'
import './styles/app.css'
import { buildScale, RATIOS, toCss, toJson, valueAt, type Config } from './lib/scale'
import { initMotion } from './motion'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const num = (id: string, fallback: number) => {
  const n = parseFloat($<HTMLInputElement>(id).value)
  return Number.isFinite(n) ? n : fallback
}

let format: 'css' | 'json' = 'css'

function fill(id: string, selected: number) {
  $<HTMLSelectElement>(id).innerHTML = RATIOS.map(
    ([label, v]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${label}</option>`,
  ).join('')
}

function config(): Config {
  const minVw = num('minVw', 320)
  return {
    minVw,
    maxVw: Math.max(minVw + 1, num('maxVw', 1440)),
    minBase: num('minBase', 16),
    maxBase: num('maxBase', 18),
    minRatio: parseFloat($<HTMLSelectElement>('minRatio').value),
    maxRatio: parseFloat($<HTMLSelectElement>('maxRatio').value),
    stepsDown: Math.min(3, Math.max(0, Math.round(num('down', 2)))),
    stepsUp: Math.min(8, Math.max(1, Math.round(num('up', 6)))),
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)

function update() {
  const c = config()
  const steps = buildScale(c)
  const vw = num('vw', 1024)
  $('vw-out').textContent = `${vw}px`
  const sample = esc($<HTMLInputElement>('sample').value || 'Hotel à beira-mar')

  $('scale').innerHTML = [...steps]
    .reverse()
    .map((s) => {
      const px = valueAt(s.minPx, s.maxPx, c.minVw, c.maxVw, vw)
      return `<li class="${s.step === 0 ? 'base' : ''}">
        <div class="meta"><b>${s.name.slice(2)}</b>${px.toFixed(1)}px<br />${s.minPx} → ${s.maxPx}</div>
        <div class="sample-text" style="font-size:${px}px">${sample}</div>
      </li>`
    })
    .join('')

  renderCode(steps)
}

function renderCode(steps = buildScale(config())) {
  $('code').textContent = format === 'css' ? toCss(steps) : toJson(steps)
}

function setFormat(f: 'css' | 'json') {
  format = f
  $('tab-css').setAttribute('aria-selected', String(f === 'css'))
  $('tab-json').setAttribute('aria-selected', String(f === 'json'))
  renderCode()
}

fill('minRatio', 1.2)
fill('maxRatio', 1.25)
;['minVw', 'maxVw', 'minBase', 'maxBase', 'down', 'up', 'vw', 'sample'].forEach((id) =>
  $(id).addEventListener('input', update),
)
;['minRatio', 'maxRatio'].forEach((id) => $(id).addEventListener('change', update))
$('tab-css').addEventListener('click', () => setFormat('css'))
$('tab-json').addEventListener('click', () => setFormat('json'))
$('copy').addEventListener('click', async () => {
  const status = $('copy-status')
  try {
    await navigator.clipboard.writeText($('code').textContent ?? '')
    status.textContent = 'Copiado para a área de transferência.'
  } catch {
    status.textContent = 'Não foi possível copiar. Selecione o texto e use Ctrl+C.'
  }
})

update()
initMotion()
