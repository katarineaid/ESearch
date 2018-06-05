function deleteDocument(esServer) {
  return function(index, type, id) {
    return esServer.delete({
      index: index,
      type: type,
      id: id,
    }).then(function(data) {
      return ({status: true, data: data})
    }, function(error) {
      return ({status: false, error: error.message})
    });
  };
}

module.exports = deleteDocument;
