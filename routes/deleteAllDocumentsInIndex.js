function deleteAllDocumentsInIndex(service) {
  return async function(req, res) {
    const params = {
      index: req.body.index,
    };
    const data = await service.deleteAllDocumentsInIndex(params);
    res.json(data);
  };
}

module.exports = deleteAllDocumentsInIndex;
