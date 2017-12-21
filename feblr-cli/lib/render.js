'use strict';

const async = require('async');
const Mustache = require('mustache');

function needIgnore(file, meta) {
  if (meta.render && meta.render.ignore && meta.render.ignore.length) {
    let ignore = meta.render.ignore;

    for (let index = 0; index < ignore.length; index++) {
      let regexp = ignore[index];
      if (regexp.test(file)) {
        return true;
      }
    }
  }

  return false;
}

module.exports = function (meta) {
  return function (files, metalsmith, done) {
    let keys = Object.keys(files);
    let prompt = metalsmith.metadata().prompt;

    Object.keys(files).forEach(function(file) {
      if (needIgnore(file, meta)) {
        return;
      }

      let str = files[file].contents.toString();
      let output = Mustache.render(str, { prompt: prompt });

      files[file].contents = new Buffer(output);
    });

    done();
  }
}
