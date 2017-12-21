"use strict";

const path = require('path');

exports.PATHS = {
  srcDir: path.join(__dirname, '../client'),
  distDir: path.join(__dirname, '../{{ prompt.distDir }}')
};
