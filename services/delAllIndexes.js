//delAllIndexes

async function listingAllIndex(apiES) {
  return await apiES.listingAllIndex();
}

async function removeIndex(index, apiES) {
  return await apiES.deleteIndex(index);
}

module.exports = function(apiES) {
  return async function(params) {
    return await delAllIndexes(params, apiES);
  };
};

async function delAllIndexes(params, apiES) {
  const key = params.key;
  if (key !== "") {
    return { status: false, statusText: 'Вы не можете удалить индексы' }
  }

  let listing = await listingAllIndex(apiES);
  if (!listing.status) {
    return listing
  }
  if (listing.data.length === 0) {
    return { status: false, statusText: 'нет данных' }
  }
  let response = [];
  for (let i = 0; i<listing.data.length;i++){
    let index = listing.data[i].index;
    let deletedIndex = await removeIndex(index, apiES)
    if (!deletedIndex.status) {
      response.push(deletedIndex)
    }
  }

  if (response.length>0){
    return response
  }

  return {status: false, statusText: 'нет данных' }
}