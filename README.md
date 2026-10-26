# Type Scale Studio

Gerador de escala tipográfica fluida para CSS. Defina tamanho base e proporção para o menor e o maior viewport, arraste a largura simulada para ver a escala mudar e exporte as variáveis com `clamp()` em CSS ou JSON.

**Demo:** https://luannrpn.github.io/type-scale-studio/

## Como funciona

Para cada passo `s`, o tamanho mínimo é `baseMin × razãoMin^s` e o máximo é `baseMax × razãoMax^s`. A interpolação linear entre os dois viewports vira:

```css
--step-0: clamp(1rem, 0.9643rem + 0.1786vw, 1.125rem);
```

onde `inclinação = (max − min) ÷ (viewportMax − viewportMin)` e `interceptação = min − inclinação × viewportMin`.

## Rodar localmente

```bash
npm install
npm run dev
npm test
npm run build
```

## Tecnologias

Vite, TypeScript, GSAP + ScrollTrigger, Lenis e [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) (`@fontsource-variable/instrument-sans`, licença OFL).

## Autoria

Autor: **Luann Neves** ([@luannrpn](https://github.com/luannrpn)). Veja [AUTHORS.md](AUTHORS.md), [LICENSE](LICENSE) (MIT) e [CITATION.cff](CITATION.cff).
