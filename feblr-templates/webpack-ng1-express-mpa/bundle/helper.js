"use strict";

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.findEntry = function(pagesDir) {
  let entry = {};

  glob.sync(path.join(pagesDir, '**/*.js')).forEach(function(file) {
    let pathObj = path.parse(file);
    let dir = pathObj.dir;
    let dirObj = path.parse(dir);
    let name = pathObj.name;
    let key = [dirObj.name, name].join('/');

    entry[key] = file;
  });

  return entry;
};

exports.createHtmlWebpackPlugins = function(entries, command) {
  let plugins = Object.keys(entries).map(function(entryName) {
    let entry = entries[entryName];
    let entryObj = path.parse(entry);
    let dirObj = path.parse(entryObj.dir);

    let filename;
    if(command == 'dev') {
      filename = dirObj.name + '.html';
    } else {
      filename = path.join('../../{{ prompt.viewsDir }}', dirObj.name + '.html');
    }

    return new HtmlWebpackPlugin({
      filename: filename,
      template: path.join(entryObj.dir, 'view.jade'),
      inject: true,
      chunks: [entryName]
    });
  });

  return plugins;
};
