"use strict";
/* jshint node: true */

const webpack = require('webpack');
const Path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const validate = require('webpack-validator');

const outputPath = 'public';

const paths = {
    build: Path.resolve(__dirname, outputPath + '/javascripts'),
    web: Path.join(__dirname, '')
};

const common = {
  // 要做編譯的檔案， key: value 對應的是匯出檔名: 原檔案路徑(可不加副檔名, 方便ts, js轉換)
  entry: {
    app: "./js/pulldownChangeSelectorStore",
    // test: './js/test'
  },
  output: {
    path: paths.build,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'] //import的時候，就可以忽略js了
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: 'babel-loader', options: {presets: ['env']}}
          // {loader: 'eslint-loader', options: {fix: true, failOnError: true}
        ]
      },
      { test: /\.ts$/, loader: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader",
          options: {
            includePaths: ["scss/main"]
          }
        }]
      }
    ]
  },
  devServer: {
    contentBase: paths.web,
    compress: true,
    // port: 9000
  }
};

let config;

switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common, {});
    break;
  default:
    config = merge(common, {});
}

module.exports = (config);


// plugins: [
//   // new HtmlWebpackPlugin({
//   //   title: 'Webpack demo'
//   // })
// ]

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.scss$/,
//         use: ExtractTextPlugin.extract({
//           fallback: 'style-loader',
//           //resolve-url-loader may be chained before sass-loader if necessary
//           use: ['css-loader', 'sass-loader']
//         })
//       }
//     ]
//   },
//   plugins: [
//     new ExtractTextPlugin({
//       filename:  (getPath) => {
//         return getPath('dist/css/[name].css').replace('css/js', 'css');
//       },
//       allChunks: true
//     })
//   ],
//   entry: {
//     app: './app/js/index.js',
//     // vendors: './app/js/vendors.js'
//   },
//   output: {
//     filename: 'bundle.js',
//     path: Path.resolve(__dirname, 'dist/js')
//   }
// };
