import { defineConfig } from 'tsup';

export default defineConfig([
  // Core bundle (framework-agnostic)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom', '@kasflow/passkey-wallet'],
  },
  // React bundle
  {
    entry: ['src/react/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/react',
    external: ['react', 'react-dom', '@kasflow/passkey-wallet'],
  },
]);
