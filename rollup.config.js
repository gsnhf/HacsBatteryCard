import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'battery-level-card.ts',
  output: {
    file: 'dist/battery-level-card.js',
    format: 'es',
  },
  plugins: [resolve(), typescript()],
};
