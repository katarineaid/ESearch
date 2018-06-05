// необходимо удалить, сейчас используется для дублирования
function testAddMappings(rp, serverConf) {
  return function(index, mappings) {
    let options = {
      method: 'PUT',
      uri: serverConf.urlES + '/' + index,
      body: {
        mappings: mappings,
      },
      json: true,
    };
    return rp(options)
    .then(function(data) {
        console.log('data', data)
        return ({status: true, data: data})
      }, function(error) {
        console.log('error', error.message)
        return ({status: false, error: error.message})
      });

  };
}

module.exports = testAddMappings;
