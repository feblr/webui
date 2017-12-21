var angular = require('angular');

function IndexPageCtrl() {
  this.message = "hello, world";
}
IndexPageCtrl.$inject = [];

var mod = angular.module('{{ prompt.name }}.pages.index', []);
mod.controller('IndexPageCtrl', IndexPageCtrl);

document.addEventListener('DOMContentLoaded', function() {
  angular.bootstrap(document, [mod.name]);
});
