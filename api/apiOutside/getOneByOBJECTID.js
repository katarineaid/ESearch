function getOneByOBJECTID(rp, serverConf) {
  return function(url, OBJECTID) {
    let options = {
      method: 'GET',
      uri: url + '/query?where=OBJECTID%3D'+OBJECTID+'&outFields=*&returnGeometry=true&outSR=4326&f=pjson',
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

module.exports = getOneByOBJECTID;