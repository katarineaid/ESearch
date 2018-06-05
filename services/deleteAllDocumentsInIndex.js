//deleteAllDocumentsInIndex

async function removeAllDocumentsInIndex(index, apiES) {
  return await apiES.deleteAllDocumentsInIndex(index);
}

module.exports = function(apiES) {
  return async function(params) {
    return await deleteAllDocumentsInIndex(params, apiES);
  };
};

async function deleteAllDocumentsInIndex(params, apiES) {
  const index = params.index;
  let deletedAllDocuments = await removeAllDocumentsInIndex(index, apiES);
  if (!deletedAllDocuments.status) {
    return ({
      statusText: 'Не удалось удалить index',
      status: false,
      error: deletedAllDocuments.error,
    });
  } else {
    return deletedAllDocuments
  }
}