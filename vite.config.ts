import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/type-scale-studio/' : '/',
  test: { include: ['src/**/*.test.ts'] },
})
