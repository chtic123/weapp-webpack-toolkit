import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
// import { terser } from 'rollup-plugin-terser';

export default {
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      // tsconfig: 'tsconfig.json',
      exclude: ['**/node_modules/**']
    }),
    babel({
      exclude: '**/node_modules/**'
    }),

    // json()
    // terser()
  ],
  external(id) {
    return id.indexOf('node_modules') >= 0;
  }
};
