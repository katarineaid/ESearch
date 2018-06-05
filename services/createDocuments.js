const update = require('immutability-helper');
const isTrue = require('../utils/isTrue');

const getType = require('../utils/getType');
const getNameService = require('../utils/getNameService');
const validationName = require('../utils/validationName');


let counter = 0;

async function getFeatures(url, apiOutside) {
  return await apiOutside.getFeatures(url)
}

async function createDocument(index, type, i, item, apiES) {
  return await apiES.addDocument(index, type, i, item);
}

async function getCount(url, apiOutside) {
  return await apiOutside.getCount(url);
}

async function getPathFeatures(url, resultOffset, apiOutside) {
  return await apiOutside.getPathFeatures(url, resultOffset);
}

module.exports = function(apiES, apiOutside, layersTree) {
  return async function(params) {
    return await createDocuments(params, apiES, apiOutside, layersTree);
  };
};

async function createDocuments(params, apiES, apiOutside, layersTree) {
  let response = [];
  const _layersTree = layersTree.layersTree;


  for (let i = 0; i < layersTree.layersTree.length; i++) {
    let item = layersTree.layersTree[i];
    //если item.url не undefined, тогда снимаем данные
    if (!item.url) {
      //'что-то пошло не так и в объекте не найден url'
    } else {
      //получаем данные с сервиса
      let count = await getCount(item.url, apiOutside)
      if (!count.status) {
        console.log('ошибка сервиса в запросе на количество записей')
        return count
      }
      if (count.data.count > 1000) {
        let putPathFeatures = await pathFeatures(item.url, count.data.count, apiES, apiOutside)
        if (!putPathFeatures.status){
          return putPathFeatures
        }
      } else {
        let download = await downloadPathFeatures(item.url, 0, apiES, apiOutside);
        if (!download.status) {
          return download
        }
      }
      response.push(undefined)
    }
  }

  return response;
}

async function pathFeatures(url, count, apiES, apiOutside) {
  //округлит до ближайшего большего целого числа
  let resultRecordCount = 500;
  let step = Math.ceil(count / resultRecordCount);
  for (let i = 0; i < step; i++) {
    let resultOffset = i * resultRecordCount;
    let download = await downloadPathFeatures(url, resultOffset, apiES, apiOutside);
    if (!download.status) {
      return download
    }
  }
  return {status: true}
}

async function downloadPathFeatures(url, resultOffset, apiES, apiOutside) {
  let pathFetures = await getPathFeatures(url, resultOffset, apiOutside);
  if (!pathFetures.status) {
    console.log('ошибка в получении части features');
    return pathFetures
  }
  // записываем полученую часть данных в документ ES
  let data = pathFetures.data;
  let respES = await prepareDocument(apiES, url, data.features, data.geometryType);
  if (!respES.status) {
    console.log('1 ошибка в записи объекта в ES', respES);
    return respES
  }
  return {status: true}
}

async function prepareDocument(apiES, url, features, geometryType) {
  let type = getType(url);

  let response = [];

  const comparison = {
    esriGeometryPoint: "point",
    esriGeometryMultipoint: "multipoint",
    esriGeometryLine: "linestring",
    esriGeometryPolyline: "linestring",
    esriGeometryPolygon: "polygon",
  };
  let length = features.length;

  if (length === 0){
    return {
      statusText: 'в запрашиваемом слое нет данных',
      status: true,
    };
  }

  for (let i = 0; i < length; i++) {
    let coordinates = [];
    let feature = features[i];
    //добавление аттрибутов
    let item = cleanAttribute(feature.attributes);
    //добавление пространственных данных
    if (comparison[geometryType] === 'point') {
      if(feature.geometry && feature.geometry.x){
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

    let createdDoc = await createDocument('test', type, id, item, apiES);
    console.log('---',counter++)
    response.push(createdDoc);
  }
  response = await Promise.all(response)
  if (!response.some(isTrue)) {
    const error = {
      statusText: 'ошибка в записи объекта в ES',
      status: false,
    };
    console.log('2', response)
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
      cleaningAtt = update(cleaningAtt, {[key]: {$set: attributes[key]}})
    }
  }
  return cleaningAtt
}


// так как удаление идет по массиву с OBJECTID логичнее будет создавать id для всех документов одного образца

function getID(url, item){
 /* if (item.GlobalID){
    console.log('GlobalID', item.GlobalID.replace('{','').replace('}',''));
    return item.GlobalID.replace('{','').replace('}','')
  }else{
    console.log('OBJECTID', getNameService(url)+'_'+item.OBJECTID);
    return getNameService(url)+'_'+item.OBJECTID;
  }*/

  return getNameService(url)+'_'+item.OBJECTID;
}

