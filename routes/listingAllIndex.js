function listingAllIndex(services) {
  return async function(req, res) {
    const data = await services.listingAllIndex();
    res.json(data);
  };
}

module.exports = listingAllIndex;
