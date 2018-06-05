
const apiES = require('./apiES');
const apiOutside = require('./apiOutside');

module.exports = function(serverConf) {
  return {
    apiES: apiES(serverConf),
    apiOutside: apiOutside(serverConf),
  };
};