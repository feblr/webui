'use strict';

const inquirer = require('inquirer');

module.exports = function (prompt) {
  return function (files, metalsmith, next) {
    return inquirer.prompt(prompt).then(function (answers) {
      metalsmith.metadata().prompt = answers;
      next();
    }, next);
  };
}
