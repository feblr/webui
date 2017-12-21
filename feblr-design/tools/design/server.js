'use strict';

const path = require('path');
const Hapi = require('hapi');
const inert = require('inert');
const parser = require('./lib/parser');
const open = require('opn');

let docHandler = function (reqquest, reply) {
  let srcDir = path.join(__dirname, '../../src');
  let pattern = '**/*.scss';
  parser.parse(srcDir, pattern)
    .then(function (data) {
      reply(data);
    }, function (err) {
      reply({
        message: err.message,
        stack: err.stack
      });
    }).catch(function(err) {
      reply({
        message: err.message,
        stack: err.stack
      });
    });
}

const port = 5455;
const server = new Hapi.Server();
server.connection({ port: port });

server.register(inert, (err) => {
  if (err) {
    console.log('can not start server: ', err);
    return;
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'tools/design/static',
        index: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/sass/{param*}',
    handler: {
      directory: {
        path: 'node_modules/sass.js/dist'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/angular/{param*}',
    handler: {
      directory: {
        path: 'node_modules/angular'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/doc',
    handler: docHandler
  });

  server.start((err) => {
    if (err) {
      console.log('can not start server: ', err);
    } else {
      console.log('server is listening on: ', server.info.uri);
      open(server.info.uri);
    }
  });
});
