const update = require('immutability-helper');
const getType = require('../utils/getType');
const getNameService = require('../utils/getNameService');
const validationName = require('../utils/validationName');

async function getOneByOBJECTID(url, OBJECTID, apiOutside) {
  return await apiOutside.getOneByOBJECTID(url, OBJECTID);
}

async function createDocument(index, type, i, item, apiES) {
  return await apiES.addDocument(index, type, i, item);
}

module.exports = function(apiES, apiOutside) {
  return async function(params) {
    return await createSomeDocs(params, apiES, apiOutside);
  };
};

async function createSomeDocs(params, apiES, apiOutside) {
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
    let createOne = await createOneDoc(url, index, type, features[i], apiES, apiOutside);
    if (!createOne.status) {
      response.push(createOne)
    }
  }

  if (response.length > 0) {
    return response
  }

  return { status: true, data: 'Объекты успешно добавлены' }
}

async function createOneDoc(url, index, type, OBJECTID, apiES, apiOutside) {
  let info = await getOneByOBJECTID(url, OBJECTID, apiOutside);
  if (!info.status) {
    return info;
  }

  let features = info.data.features;
  let geometryType = info.data.geometryType;

  let length = features.length;
  if (length === 0) {
    return {
      statusText: 'в запрашиваемом слое нет данных об объекте ' + OBJECTID,
      status: true,
    };
  }

  const comparison = {
    esriGeometryPoint: "point",
    esriGeometryMultipoint: "multipoint",
    esriGeometryLine: "linestring",
    esriGeometryPolyline: "linestring",
    esriGeometryPolygon: "polygon",
  };

  let coordinates = [];
  let feature = features[0];

  //добавление аттрибутов
  let item = cleanAttribute(feature.attributes);
  //добавление пространственных данных
  if (comparison[geometryType] === 'point') {
    if (feature.geometry && feature.geometry.x) {
      coordinates.push(feature.geometry.x, feature.geometry.y)
    }
  } else if (comparison[geometryType] === 'linestring') {
    coordinates.push(feature.geometry.paths)
  } else if (comparison[geometryType] === 'polygon') {
    coordinates.push(feature.geometry.rings)
  }

  item = update(item, {
    "geometry": {
      $set: {
        "type": comparison[geometryType],
        "coordinates": coordinates
      }
    }
  });

  let id = getID(url, item);


  let createdDoc = await createDocument(index, type, id, item, apiES);
  console.log('---')
  if (!createdDoc.status) {
    return createdDoc
  }
  return { status: true, statusText: 'объект с OBJECTID=' + OBJECTID + 'добавлен' }
}


function cleanAttribute(attributes) {
  let cleaningAtt = {};
  let keys = Object.keys(attributes)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (validationName(keys[i])) {
      cleaningAtt = update(cleaningAtt, { [key]: { $set: attributes[key] } })
    }
  }
  return cleaningAtt
}

function getID(url, item) {
  return getNameService(url) + '_' + item.OBJECTID;
}


