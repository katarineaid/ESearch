function getCount(rp, serverConf) {
  return function(url) {
    let options = {
      method: 'GET',
      uri: url + '/query?where=1%3D1&returnCountOnly=true&f=pjson',
      json: true,
    };
    return rp(options)
      .then(function(data) {
        return ({ status: true, data: data })
      }, function(error) {
        return ({ status: false, error: error })
      });
  };
}

module.exports = getCount;