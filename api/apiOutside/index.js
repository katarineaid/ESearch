let rp = require('request-promise');

const getStructure = require('./getStructure');
const getFeatures = require('./getFeatures');
const getCount = require('./getCount');
const getPathFeatures = require('./getPathFeatures');
const getOneByOBJECTID = require('./getOneByOBJECTID');

module.exports = function(serverConf) {
  return {
    getStructure: getStructure(rp, serverConf),
    getFeatures: getFeatures(rp, serverConf),
    getCount: getCount(rp, serverConf),
    getPathFeatures: getPathFeatures(rp, serverConf),
    getOneByOBJECTID: getOneByOBJECTID(rp, serverConf),
  };
};