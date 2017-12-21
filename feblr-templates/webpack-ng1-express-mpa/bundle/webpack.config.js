"use strict";

const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PATHS = require('./paths').PATHS;
const helper = require('./helper');
let baseConfig = require('./webpack.base');

const command = process.env.npm_lifecycle_event;

let entry = helper.findEntry(path.join(PATHS.srcDir, 'pages'));

let commonCfg = {
  entry: entry
};

let buildCfg = {
  output: {
    path: path.join(PATHS.distDir, 'pages')
  }
};

let entryHtmlPlugins = helper.createHtmlWebpackPlugins(entry, command);
let copyPlugin = CopyWebpackPlugin([
  {
    from: path.join(PATHS.srcDir, 'static'),
    to: path.join(PATHS.distDir, 'static')
  }
]);

const devCfg = {
  output: {
    path: path.join(PATHS.distDir)
  },
  devServer: {
    outputPath: path.join(PATHS.distDir),
    contentBase: path.join(PATHS.distDir)
  }
};

let config;
switch(command) {
  case 'build':
    config = merge(baseConfig.buildCfg, commonCfg, buildCfg);
  break;
  case 'dev':
    config = merge(baseConfig.devCfg, commonCfg, devCfg);
  break;
}

config.plugins = config.plugins.concat(entryHtmlPlugins).concat([copyPlugin]);

module.exports = config;
