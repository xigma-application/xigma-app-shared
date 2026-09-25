import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  external: ['react', 'react-dom', '@radix-ui/react-tooltip'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  splitting: false,
});
