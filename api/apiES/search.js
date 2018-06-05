function search(rp, serverConf) {
  return function(query) {
    let options = {
      method: 'POST',
      uri: serverConf.urlES + '/_search',
      body: {
        query: {
          query_string: {
            query: query,
          }
        }
      },
      json: true,
    };
    return rp(options)
      .then(function(data) {
        return ({status: true, data: data})
      }, function(error) {
        return ({status: false, error: error.message})
      });
  };
}

module.exports = search;
