import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts', 'src/config.ts', 'src/providers/index.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
})
