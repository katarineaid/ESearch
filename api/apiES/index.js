let elasticsearch = require('elasticsearch');
let rp = require('request-promise');

const getDocument = require('../apiES/getDocument');
const createIndex = require('../apiES/createIndex');
const deleteDocument = require('../apiES/deleteDocument');
const deleteIndex = require('../apiES/deleteIndex');
const search = require('../apiES/search');
const addMappings = require('../apiES/addMappings');
const addDocument = require('../apiES/addDocument');
const listingAllIndex = require('../apiES/listingAllIndex');
const testAddMappings = require('../apiES/testAddMappings');
const deleteAllDocumentsInIndex = require('../apiES/deleteAllDocumentsInIndex');


module.exports = function(serverConf) {
  let esServer = new elasticsearch.Client({
    host: serverConf.urlES,
  });
  return {
    listingAllIndex: listingAllIndex(esServer),
    getDocument: getDocument(esServer),
    createIndex: createIndex(esServer),
    deleteDocument: deleteDocument(esServer),
    deleteIndex: deleteIndex(esServer),
    deleteAllDocumentsInIndex: deleteAllDocumentsInIndex(esServer),
    addMappings: addMappings(rp, serverConf),
    //addDocument: addDocument(esServer),
    addDocument: addDocument(rp, serverConf),
    search: search(rp, serverConf),
    testAddMappings: testAddMappings(rp, serverConf),
  };
};
