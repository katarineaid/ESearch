/**
 * Функция по добавлению документа в ES
 * @param esServer
 * @returns {Function}
 */

/*function addDocument(esServer) {
  return function(index, type, id, body) {
    console.log('body', body)
    return esServer.create({
      index: index,
      type: type,
      body: body,
    }).then(function(data) {
      return ({status: true, data: data})
    }, function(error) {
      return ({status: false, error: error.message})
    });
  };
}

module.exports = addDocument;*/

function addDocument(rp, serverConf) {
  return function(index, type, id, body) {
    let options = {
      method: 'PUT',
      uri: serverConf.urlES + '/' + index + '/' + type + '/' + id,
      body: {
        mappings: body,
      },
      json: true,
    };
    return rp(options).then(function(data) {
      return ({ status: true, data: data })
    }, function(error) {
      return ({ status: false, error: error.message })
    });
  };
}

module.exports = addDocument;

/**
 * Функция по добавлению документа в ES с автоматической генерацией его id
 * @param rp
 * @param serverConf
 * @returns {Function}
 */
/*function addDocument(rp,serverConf) {
  return function(index, type, id, body) {
    let options = {
      method: 'POST',
      uri: serverConf.urlES + '/' + index+ '/'+type+'/',
      body: {
        mappings: body,
      },
      json: true,
    };


    return rp(options).then(function(data) {
      return ({status: true, data: data})
    }, function(error) {
      return ({status: false, error: error.message})
    });
  };
}

module.exports = addDocument;*/
