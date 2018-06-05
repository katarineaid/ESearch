const update = require('immutability-helper');

async function getStructure(url, apiOutside) {
  return await apiOutside.getStructure(url)
}

async function createDocument(index, type, i, item, apiES) {
  return await apiES.addDocument(index, type, i, item);
}

module.exports = function(apiES, apiOutside) {
  return async function(params) {
    return await createOneDoc(params, apiES, apiOutside);
  };
};

async function createOneDoc(params, apiES, apiOutside) {

  const url = params.url;
  const feature = params.feature;

  let structureService = await getStructure(url, apiOutside);
  if (!structureService.status) {
    return structureService
  }

  let geometryType = structureService.data.geometryType;

  let respES = await prepareDocument(apiES, url, feature, geometryType);
  if (!respES.status) {
    console.log('1 ошибка в записи объекта в ES', respES);
    return respES
  }
  return { status: true, data: 'Объект успешно добавлен' }

}

async function prepareDocument(apiES, url, feature, geometryType) {
  let type;
  let arr = url.split('LE/');
  let re = /[/]/gi;
  console.log('arr', arr)

  if (arr.length === 1) {
    type = arr[0].replace(re, '_').toLowerCase();
  } else {
    type = arr[1].replace(re, '_').toLowerCase();
  }
  console.log('type', type)

  const comparison = {
    esriGeometryPoint: "point",
    esriGeometryMultipoint: "multipoint",
    esriGeometryLine: "linestring",
    esriGeometryPolyline: "linestring",
    esriGeometryPolygon: "polygon",
  };

  let coordinates = [];

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

  let id = getID(url, item)


  let createdDoc = await createDocument('test', type, id, item, apiES);
  if (!createdDoc.status) {
    const error = {
      statusText: 'ошибка в записи объекта в ES',
      status: false,
    };
    console.log('2', createdDoc)
    return error;
  }
  return {
    statusText: 'данные объекта добавлены в ES',
    status: true,
  };
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

function validationName(name) {
  if (name.indexOf('SHAPE') !== -1) {
    return false
  }
  if (name.indexOf('.') !== -1) {
    return false
  }
  if (name.indexOf('(') !== -1) {
    return false
  }
  if (name.indexOf(')') !== -1) {
    return false
  }
  return true
}

function getID(url, item) {
  if (item.GlobalID) {
    console.log('GlobalID', item.GlobalID.replace('{', '').replace('}', ''));
    return item.GlobalID.replace('{', '').replace('}', '')
  } else {
    console.log('OBJECTID', getNameService(url) + '_' + item.OBJECTID);
    return getNameService(url) + '_' + item.OBJECTID;
  }
}

function getNameService(url) {
  let step1 = url.split('services/');
  let step2 = step1[1].split('/');

  if (step2[0] === 'LE') {
    return step2[1].toLowerCase()
  } else {
    return step2[0].toLowerCase()
  }
}