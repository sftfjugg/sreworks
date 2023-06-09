import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
import requireContext from 'rollup-plugin-require-context'
const glob = require('glob')
const path = require('path')

const configFn = (name) => ({
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    commonjs(),
    requireContext(),
    postcss({
      use: [
        [
          'less',
          {
            javascriptEnabled: true,
          },
        ],
        ['sass'],
      ],
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
})

const mainConfig = {
  input: './src/index.js',
  output: [
    {
      file: './dist/index-umd.js',
      format: 'umd',
      name: 'sre_utils',
    },
    {
      file: './dist/index-es.js',
      format: 'es',
    },
    {
      file: './dist/index-cjs.js',
      format: 'cjs',
    },
  ],
  sourcemap: false,
  ...configFn('index'),
}
mainConfig.plugins.unshift(del({ targets: ['lib/*', 'dist/*'] }))

export default [mainConfig]
