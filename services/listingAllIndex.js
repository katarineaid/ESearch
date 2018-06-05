async function getStatusAllIndex(apiES) {
  return await apiES.listingAllIndex();
}

module.exports = function(apiES) {
  return async function listingAllIndex() {
    return await listing(apiES);
  };
};

async function listing(apiES) {
  let statusAllIndex = await getStatusAllIndex(apiES);
  if (!statusAllIndex.status) {
    return ({
      statusText: 'Не удалось найти информацию, проверьте работоспособсноть ES',
      status: false,
      error: statusAllIndex.error,
    });
  } else {
    return statusAllIndex
  }
}