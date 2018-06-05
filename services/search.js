async function search(query, apiES) {
  return await apiES.search(query);
}

module.exports = function(apiES) {
  return async function firstGet(params) {
    return await firstFunction(params, apiES);
  };
};

async function firstFunction(params, apiES) {
  let {query} = params;
  let updatedQuery = updateQuery(query);
  return await search(updatedQuery, apiES);
}

function updateQuery(query) {
  query = query.split(' ');

  if (query.length !== 1) {
    let newQuery = '';
    for (let i = 0; i < query.length; i++) {
      if (i === query.length - 1) {
        newQuery = newQuery + query[i] + ' OR ' + query[i] + '* OR *' + query[i] + 'OR *' + query[i] + '*';
      } else {
        newQuery = newQuery + query[i] + ' OR ' + query[i] + '* OR *' + query[i] + 'OR *' + query[i] + '*' + ' OR ';
      }
    }
    return newQuery
  } else {
    query = query + ' OR ' + query + '* OR *' + query + 'OR *' + query + '*';
    return query
  }
}