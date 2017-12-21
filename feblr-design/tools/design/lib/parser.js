'use strict';

const path = require('path');
const fs = require('fs');
const parser = require('comment-parser');
const glob = require('glob');

let readFile = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf-8', function (err, content) {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
};

let extractComponentName = function (filePath) {
  let fileName = path.parse(filePath).name;

  return fileName[1].toUpperCase() + fileName.slice(2);
}

let parseFile = function (filePath) {
  return readFile(filePath).then((content) => {
    let comments = parser(content);
    let name = extractComponentName(filePath);
    let args = [];

    let components = [];
    comments.forEach(function (comment) {
      let component = {
        name: '',
        klass: '',
        modifier: '',
        args: [],
        usages: [],
        examples: []
      };
  
      comment.tags.forEach(function (tag) {
        switch (tag.tag) {
          case 'name':
            component.name = tag.name;
            break;
          case 'klass':
            component.klass = tag.name;
            break;
          case 'modifier':
            component.modifier = tag.name;
            break;
          case 'arg':
            component.args.push(tag);
            break;
          case 'example':
            component.examples.push(tag);
            break;
          case 'usage':
            component.usages.push(tag);
            break;
        }
      });

      components.push(component);
    });

    return {
      name: name,
      path: filePath,
      content: content,
      components: components
    };
  }, (err) => {
    return Promise.reject(err);
  });
};

let parse = function (root, pattern) {
  let srcDir = path.join(root, pattern);
  return new Promise(function (resolve, reject) {
    glob(srcDir, function (err, filePaths) {
      if (err) {
        reject(err);
      } else {
        Promise.all(filePaths.map(parseFile))
          .then(function(files) {
            let rootLen = root.length;
  
            resolve({
              root: root,
              files: files.map(function(file) {
                file.path = file.path.slice(rootLen);

                return file;
              })
            });
          }, reject).catch(reject);
      }
    })
  });
};

exports.parse = parse;
