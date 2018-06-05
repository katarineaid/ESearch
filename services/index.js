
const createFromServices = require('./createFromServices');
const createDocuments = require('./createDocuments');
const deleteIndex = require('./deleteIndex');
const listingAllIndex = require('./listingAllIndex');
const deleteAllDocumentsInIndex = require('./deleteAllDocumentsInIndex');
const createOneDoc = require('./createOneDoc');
const deleteDocs = require('./deleteDocs');
const createSomeDocs = require('./createSomeDocs');
const search = require('./search');
const delAllIndexes = require('./delAllIndexes');

module.exports = function(api, serverConf, layersTree) {
  const {apiES, apiOutside} = api;
  return {
    createFromServices: createFromServices(apiES, apiOutside, layersTree),
    createDocuments: createDocuments(apiES, apiOutside, layersTree),
    deleteIndex: deleteIndex(apiES),
    listingAllIndex: listingAllIndex(apiES),
    deleteAllDocumentsInIndex: deleteAllDocumentsInIndex(apiES),
    createOneDoc: createOneDoc(apiES, apiOutside),
    search: search(apiES),
    deleteDocs: deleteDocs(apiES, apiOutside),
    createSomeDocs: createSomeDocs(apiES, apiOutside),
    delAllIndexes: delAllIndexes(apiES),
  };
};