async function removeIndex(index, apiES) {
  return await apiES.deleteIndex(index);
}

module.exports = function(apiES) {
  return async function(params) {
    return await deleteIndex(params, apiES);
  };
};

async function deleteIndex(params, apiES) {
  const index = params.index;
  let deletedIndex = await removeIndex(index, apiES);
  if (!deletedIndex.status) {
    return ({
      statusText: 'Не удалось удалить index',
      status: false,
      error: deletedIndex.error,
    });
  } else {
    return deletedIndex
  }
}