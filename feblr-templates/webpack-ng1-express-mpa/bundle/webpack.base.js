"use strict";

const url = require('url');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const API_SERVER_URL = "http://{{prompt.domain}}";
const API_SERVER = url.parse(API_SERVER_URL);

const devCfg = {
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.jade$/,
        loaders: ['jade']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,

    stats: 'error-only',

    host: '0.0.0.0',
    port: 8888
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

const buildCfg = {
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '/pages'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextWebpackPlugin.extract(["css"])
      },
      {
        test: /\.jade$/,
        loaders: ['jade']
      }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  },
  plugins: [
    new ExtractTextWebpackPlugin("[name].[contenthash].css"),
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      laxcomma: false
    })
  ]
};

module.exports = {
  buildCfg,
  devCfg
};
