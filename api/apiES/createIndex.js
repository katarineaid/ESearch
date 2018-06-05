function createIndex(esServer) {
  return function(index) {
    return esServer.indices.create({
      index: index
    }).then(function(data) {
      return ({status: true, data: data})
    }, function(error) {
      return ({status: false, error: error.message})
    });
  };
}

module.exports = createIndex;
