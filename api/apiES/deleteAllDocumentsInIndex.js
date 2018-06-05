function deleteAllDocumentsInIndex(esServer) {
  return function(index) {
    return esServer.deleteByQuery({
      index: index,
      body: {
        query: {
          "match_all": {}
        }
      }
    }).then(function(data) {
      return ({ status: true, data: data })
    }, function(error) {
      return ({ status: false, error: error.message })
    });
  };
}

module.exports = deleteAllDocumentsInIndex;