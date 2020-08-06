/**
 * ★どんなことができるか★
 * TypeScriptをコンパイル（ES5）
 * SCSSをコンパイル
 * CSSとJSを一緒にバンドルしない
 * PostCSS(Autoprefixer)で自動ベンダープレフィックス
 */

const path = require('path');

// 'production' か 'development' を指定
const MODE = 'development';

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === 'development';

// plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
  // モード指定
  mode: MODE,
  // メインとなるファイル（エントリーポイント）
  entry: {
    'js/main': ['./src/ts/main.ts'],
    'css/style': ['./src/scss/index.scss']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader'
      },
      // Sassファイルの読み込みとコンパイル
      {
        // 対象となるファイルの拡張子
        test: /\.scss/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // javascriptとしてバンドルせず css として出力する
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // CSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
              // Sass+PostCSSの場合は2を指定
              importLoaders: 2
            }
          },
          // PostCSSのための設定
          {
            loader: 'postcss-loader',
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: enabledSourceMap,
              plugins: [
                // Autoprefixerを有効化
                // ベンダープレフィックスを自動付与する
                require('autoprefixer')({
                  grid: true
                })
              ]
            }
          },
          // Sassをバンドルするための機能
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap
            }
          }
        ]
      }
    ]
  },
  // import 文で .js .ts ファイルを解決するため
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};
