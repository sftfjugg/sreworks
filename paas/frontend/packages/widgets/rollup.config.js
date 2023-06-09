/*
 * @version: 2.0.0
 * @Author: deeham.ww
 * @Date: 2022-11-03 00:13:28
 * @LastEditors: deeham.ww
 * @LastEditTime: 2022-11-22 14:10:37
 */
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import url from '@rollup/plugin-url'
import requireContext from 'rollup-plugin-require-context'

const glob = require('glob')
const path = require('path')

const componentsObject = glob
  .sync(`src/srewidgets/**/index.js`, {
    dot: true,
  })
  .map((x) => path.resolve(x))
  .map((x) => path.dirname(x).split(path.sep).pop())
  .reduce((p, name) => {
    p[name] = `./src/srewidgets/${name}/index.js`
    return p
  }, {})

const configFn = (name) => ({
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    commonjs(),
    requireContext(),
    image(),
    json(),
    url({
      limit: 10240, // 大于10k，打包生成单独静态资源，否则处理成 base64
      fileName: 'assets/[name].[hash][extname]',
    }),
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
      plugins: [autoprefixer(), cssnano()],
      extract: `theme/${name}.css`,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    terser(),
  ],
  external: ['react', 'react-dom', 'bizcharts'],
})

const libConfigs = Object.keys(componentsObject).map((name) => {
  const config = configFn(name)
  config.input = [componentsObject[name]]
  config.output = {
    file: './lib/' + name + '.js',
    format: 'es',
  }
  return config
})

const mainConfig = {
  input: './src/index.js',
  output: [
    {
      file: './dist/index-umd.js',
      format: 'umd',
      name: 'sre_widgets',
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
  ...configFn('index'),
}
mainConfig.plugins.unshift(del({ targets: ['lib/*', 'dist/*'] }))

export default [mainConfig, ...libConfigs]
