function getStructure(rp, serverConf) {
  return function(url) {
    let options = {
      method: 'GET',
      uri: url + '?f=pjson',
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

module.exports = getStructure;
