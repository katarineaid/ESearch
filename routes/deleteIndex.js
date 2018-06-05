function deleteIndex(service) {
  return async function(req, res) {
    const params = {
      index: req.body.index,
    };
    const data = await service.deleteIndex(params);
    res.json(data);
  };
}

module.exports = deleteIndex;
