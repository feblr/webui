var mod = angular.module('feblr.design.editor', []);

function trustAsHtml($sce) {
  return function (str) {
    return $sce.trustAsHtml(str);
  }
}
trustAsHtml.$inject = ['$sce'];

function SassCompiler($q) {
  this.$q = $q;
  this.compiler = new Sass('/sass/sass.worker.js');
  this.root = null;
}

SassCompiler.prototype.compile = function (content) {
  var defer = this.$q.defer();

  this.compiler.compile(content, function (result) {
    if (result.status == 0) {
      defer.resolve(result);
    } else {
      defer.reject(result);
    }
  });

  return defer.promise;
}

SassCompiler.prototype.compileFile = function (file) {
  var defer = this.$q.defer();

  this.compiler.compileFile(file, function (result) {
    if (result.status == 0) {
      defer.resolve(result);
    } else {
      defer.reject(result);
    }
  });

  return defer.promise;
}

SassCompiler.prototype.register = function (files) {
  var defer = this.$q.defer();

  this.compiler.writeFile(files, function (result) {
    var succeed = true;
    for (var key in result) {
      if (result[key] === false) {
        succeed = false;
        break;
      }
    }

    if (succeed) {
      defer.resolve(result);
    } else {
      defer.reject(result);
    }
  });

  return defer.promise;
}

SassCompiler.$inject = ['$q'];

function MainCtrl($http, SassCompiler) {
  var self = this;
  this.themes = [];
  this.files = [];
  this.current = null;

  var init = function () {
    $http.get('/doc').then(function (res) {
      var data = res.data;
      if (data && data.files) {
        angular.forEach(data.files, function (file) {
          if (/\/themes\/.*\.scss/.test(file.path)) {
            self.themes.push(file);
          } else {
            self.files.push(file);
          }

          angular.forEach(file.components, function (component) {
            angular.forEach(component.args, function (arg) {
              arg.defaults = parseArg(arg);
              arg.config = parseArg(arg);
            })
          });
        });

        self.current = self.files[0];

        var sassMap = {};
        angular.forEach(data.files, function (file) {
          sassMap[file.path] = file.content;
        });

        SassCompiler.register(sassMap).then(function (result) {
          self.compileStyle(self.themes, self.files);
        }, function (result) {
          console.log(result);
        });
      };
    });
  };

  init();

  this.selectFile = function (file) {
    self.current = file;
  };

  this.customizeComponent = function (component) {
    self.component = component;
  };

  var parseArg = function (arg) {
    var parts = arg.type.split('.');
    var detail = {
      type: parts[0],
      value: parts[1],
      unit: parts[2]
    };

    return detail;
  };

  this.restoreArg = function (themes, files, arg) {
    arg.config = parseArg(arg);
    self.compileStyle(themes, files);
  };

  var collectVars = function (file) {
    var args = [];
    angular.forEach(file.components, function (component) {
      angular.forEach(component.args, function (arg) {
        args.push(arg);
      });
    });

    return args.map(function (arg) {
      if (arg.config.value) {
        return arg.name + ': ' + arg.config.value + ';\n';
      } else {
        return '';
      }
    }).join('')
  }

  var createEntryFile = function (path, theme, importFiles, prefix) {
    var themeVars = collectVars(theme);

    var importDirs = [];
    importDirs.push('@import \'' + theme.path + '\';\n');

    var includeDirs = [];
    importFiles.forEach(function (file) {
      importDirs.push('@import \'' + file.path + '\';\n');

      file.components.forEach(function (component) {
        var map = '(' + component.args.map(function (arg) {
          if (arg.config.value) {
            return arg.name + ': ' + arg.config.value;
          } else {
            return '';
          }
        }).join(',') + ')';

        component.usages.forEach(function (usage) {
          var includeDir = usage.description.replace(/(\+[a-zA-Z]+)/g, function (match) {
            var value;
            switch (match) {
              case '+config':
                value = map;
                break;
              case '+modifier':
                value = component.modifier;
                break;
              case '+theme':
                value = '"' + prefix + '"';
                break;
              default:
                value = match;
            }

            return value;
          });

          includeDirs.push('@include ' + includeDir + ';\n');
        });
      });
    });

    var file = {
      path: path,
      content: themeVars + '\n' + importDirs.join('') + includeDirs.join('')
    };

    return file;
  }

  this.compileStyle = function (themes, files) {
    var entry = createEntryFile('styles.css', themes[0], files, "");

    SassCompiler.compile(entry.content).then(function (result) {
      var styleElem = document.getElementById(entry.path);
      if (!styleElem) {
        styleElem = document.createElement('style');
        styleElem.id = entry.path;
        document.head.appendChild(styleElem);
      }
      styleElem.textContent = result.text;
    }, function (result) {
      console.log(result.message);
    });
  };

  var DIALOG_STATE = {
    CONFIG: "CONFIG",
    COMPILING: "COMPILING",
    DOWNLOAD: "DOWNLOAD"
  };

  this.dialog = {
    show: false,
    state: DIALOG_STATE.CONFIG,
    form: {
      prefix: ''
    },
    styles: {
      css: {
        href: ''
      },
      scss: {
        href: ''
      }
    }
  };

  this.openDialog = function (dialog) {
    dialog.show = true;
  };

  this.closeDialog = function (dialog, $event) {
    var target = $event.target || $event.srcElement;
    if ($event.target.classList.contains("feblr-dialog")) {
      dialog.show = false;

      dialog.state = DIALOG_STATE.CONFIG;
    }
  };

  var createDownloadLink = function (text, type) {
    var file = new Blob([text], { type: type });
    var href = URL.createObjectURL(file);

    return href;
  }

  this.generate = function (themes, files, dialog) {
    dialog.state = DIALOG_STATE.COMPILING;

    var entry = createEntryFile('styles.scss', themes[0], files, dialog.form.prefix);

    SassCompiler.compile(entry.content).then(function (result) {
      dialog.state = DIALOG_STATE.DOWNLOAD;

      dialog.styles.css.href = createDownloadLink(result.text, 'text/plain');;
      dialog.styles.scss.href = createDownloadLink(entry.content, 'text/plain');;
    }, function (result) {
      console.log(result);
    });
  };
}
MainCtrl.$inject = ['$http', 'SassCompiler'];

mod.controller('MainCtrl', MainCtrl)
  .service('SassCompiler', SassCompiler)
  .filter('trustAsHtml', trustAsHtml);

function config($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob):/);
}
config.$inject = ['$compileProvider'];

mod.config(config);

document.addEventListener('DOMContentLoaded', function () {
  angular.bootstrap(document, ['feblr.design.editor']);
});
