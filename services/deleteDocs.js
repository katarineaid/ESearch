
const getType = require('../utils/getType');
const getNameService = require('../utils/getNameService');

async function deleteDoc(index, type, id, apiES) {
  return await apiES.deleteDocument(index, type, id);
}

module.exports = function(apiES, apiOutside) {
  return async function(params) {
    return await deleteDocs(params, apiES, apiOutside);
  };
};

async function deleteDocs(params, apiES) {
  const url = params.url;
  const features = params.features;
  if (!url || !features) {
    const error = {
      statusText: 'Вы прислали мне в features: ' + features +
      ' , а в url: ' + url,
      status: false,
    };
    return error;
  }

  if (features.length === 0) {
    const error = {
      statusText: 'Объект features пустой ',
      status: false,
    };
    return error;
  }

  let index = 'test';
  let type = getType(url);

  //Сборщик ошибок для проверки
  let response = [];

  for (let i = 0; i < features.length; i++) {
    let id = getNameService(url) + '_' + features[i];
    let delDoc = await deleteDoc(index, type, id, apiES);
    if (!delDoc.status) {
      response.push(delDoc)
    }
  }

  if (response.length > 0) {
    return response
  }

  return { status: true, data: 'Объекты успешно удалены' }
}
