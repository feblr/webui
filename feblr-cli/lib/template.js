'use strict';

const path = require('path');
const fs = require('fs');
const feblrTemplates = require('feblr-templates');
const feblrTemplatesDir = path.join(require.resolve('feblr-templates'), '..');

exports.getTemplateDir = function (templateName) {
  let templateDir = path.join(feblrTemplatesDir, templateName);
  try {
    let stat = fs.statSync(templateDir);
    if (stat.isDirectory()) {
      return templateDir;
    } else {
      throw new Error('template path is not a directory: ' + templateDir);
    }
  } catch (e) {
    throw new Error('can not access template directory: ' + templateDir);
  }
}

exports.getTemplates = function() {
  return feblrTemplates.templates;
}
