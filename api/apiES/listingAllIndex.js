function listingAllIndex(esServer) {
  return function() {
    return esServer.cat.indices({
      format: 'json'
    }).then(function(data) {
      return ({status: true, data: data})
    }, function(error) {
      return ({status: false, error: error.message})
    });
  };
}

module.exports = listingAllIndex;
