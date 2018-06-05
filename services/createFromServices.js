const getType = require('../utils/getType');


async function getStructure(url, apiOutside) {
  return await apiOutside.getStructure(url)
}

async function addMapping(index, mapping, settings, apiES) {
  return await apiES.addMappings(index, mapping, settings)
}

module.exports = function(apiES, apiOutside, layersTree) {
  return async function(params) {
    return await createFromServices(params, apiES, apiOutside, layersTree);
  };
};

async function createFromServices(params, apiES, apiOutside, layersTree) {
  let response = [];
  let table;

  for (let i = 0; i < layersTree.layersTree.length; i++) {
    let item = layersTree.layersTree[i];

    //если item.url не undefined, тогда снимаем данные

    if (!item.url) {
      //'что-то пошло не так и в объекте не найден url'
    } else {
      //получаем данные с сервиса
      let structure = await getStructure(item.url, apiOutside);
      if (!structure.status) {
        //обработка ошибки
      } else {
        structure = structure.data;
        // создаем mapping сервиса для ES
        let response = await prepareMapping(item.url, structure.fields, structure.geometryType);

        table = await addMapping(response.index, response.mapping, response.settings, apiES)
      }
      response.push(table)
    }
  }
  return response
}

async function prepareMapping(url, fields, geometryType) {
  let type = getType(url);

  const comparison = {
    esriFieldTypeSmallInteger: "integer",
    esriFieldTypeInteger: "integer",
    esriFieldTypeSingle: "float",
    esriFieldTypeDouble: "double",
    esriFieldTypeString: "string",
    esriFieldTypeDate: "date",
    esriFieldTypeOID: "long",
    esriFieldTypeBlob: "binary",
    esriFieldTypeGUID: "string",
    esriFieldTypeGlobalID: "string",
    esriGeometryPoint: "geo_shape",
    esriGeometryMultipoint: "geo_shape",
    esriGeometryLine: "geo_shape",
    esriGeometryPolyline: "geo_shape",
    esriGeometryPolygon: "geo_shape",
  };

  let properties = {};
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    if (field.type !== 'esriFieldTypeGeometry') {
      if (comparison[field.type] === 'string') {
        properties = Object.assign({}, properties, {
          [field.name]: {
            "type": comparison[field.type],
          }
        })
      } else {
        properties = Object.assign({}, properties, {
          [field.name]: {
            "type": comparison[field.type]
          }
        })
      }
    }
  }

  let response = {
    mapping: {
      [type]: {
        "properties": Object.assign({}, properties, {
          geometry: {
            "type": comparison[geometryType]
          }
        })
      }
    },
    settings: {
      "analysis": {
        "analyzer": {
          "default": {
            "tokenizer": "standard",
            "filter": [
              "lowercase",
              "russian_stop",
              "russian_stemmer",
              "my_stopwords"
            ]
          }
        },
        "filter": {
          "my_stopwords": {
            "type": "stop",
            "stopwords": ["а", "без", "более", "бы", "был", "была", "были", "было", "быть", "в", "вам", "вас", "весь", "во", "вот", "все", "всего", "всех", "вы", "где", "да", "даже", "для", "до", "его", "ее", "если", "есть", "еще", "же", "за", "здесь", "и", "из", "или", "им", "их", "к", "как", "ко", "когда", "кто", "ли", "либо", "мне", "может", "мы", "на", "надо", "наш", "не", "него", "нее", "нет", "ни", "них", "но", "ну", "о", "об", "однако", "он", "она", "они", "оно", "от", "очень", "по", "под", "при", "с", "со", "так", "также", "такой", "там", "те", "тем", "то", "того", "тоже", "той", "только", "том", "ты", "у", "уже", "хотя", "чего", "чей", "чем", "что", "чтобы", "чье", "чья", "эта", "эти", "это", "я", "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"],
          },
          "russian_stop": {
            "type": "stop",
            "stopwords": "_russian_"
          },
          "russian_stemmer": {
            "type": "stemmer",
            "language": "russian"
          }
        },
      }
    },
    index: 'test'
  };
  return response
}


/*
  let properties = {};
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    properties = Object.assign({}, properties, {
      [field.name]: {
        "type": comparison[field.type]
      }
    })
  }


  let response = {
    mapping: {
      [type]: {
        "properties": Object.assign({}, properties, {
          geometry: {
            "type": comparison[geometryType]
          }
        })
      }
    },
    index: type
  }
*/