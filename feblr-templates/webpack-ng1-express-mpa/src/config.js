var fs = require('fs');
var argv = require('optimist').argv;
var toml = require('toml');

var parseFile = function (configFilePath) {
  var configFile = fs.readFileSync(configFilePath);
  var config = toml.parse(configFile);

  return config;
};

var config = parseFile('./config.toml');
var env = process.env["NODE_ENV"];

var envConfig = {};

Object.keys(config).forEach(function(itemKey) {
  var configItem = config[itemKey];
  if(configItem[env]) {
    envConfig[itemKey] = configItem[env];
  } else {
    envConfig[itemKey] = configItem;
  }
});

envConfig.env = env;

module.exports = envConfig;
