function addMappings(rp, serverConf) {
  return function(index, mappings, settings) {
    let options = {
      method: 'PUT',
      uri: serverConf.urlES + '/' + index,
      body: {
        settings: settings,
        mappings: mappings,
      },
      json: true,
    };
    return rp(options)
      .then(function(data) {
        return ({status: true, data: data})
      }, function(error) {
        return ({status: false, error: error})
      });
  };
}

module.exports = addMappings;
