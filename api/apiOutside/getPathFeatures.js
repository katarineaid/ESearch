function getPathFeatures(rp, serverConf) {
  return function(url,resultOffset) {
    let options = {
      method: 'GET',
      uri: url + '/query?where=1%3D1&outFields=*&returnGeometry=true&resultOffset='+resultOffset+'&resultRecordCount=500&outSR=4326&f=pjson',
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

module.exports = getPathFeatures;