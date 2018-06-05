function deleteIndex(esServer) {
  return function(index) {
    return esServer.indices.delete({
      index: index,
    }).then(function(data) {
      return ({status: true, data: data})
    }, function(error) {
      return ({status: false, error: error.message})
    });
  };
}

module.exports = deleteIndex;
