'use strict';

const path = require('path');
const Metalsmith = require('metalsmith');
const prompt = require('./prompt');
const render = require('./render');

module.exports = function(templateDir, destination) {
  let metaFile = path.join(templateDir, 'feblr-meta.js');
  let meta = require(metaFile);

  Metalsmith(templateDir)
    .use(prompt(meta.prompt))
    .use(render(meta))
    .source('.')
    .destination(destination)
    .build(function (err, files) {
      if (err) {
        console.log(err);
        console.log(err.stack);
      }
    });
}
