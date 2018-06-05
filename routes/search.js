function search(service) {
  return async function(req, res) {
    const params = {
      query: req.body.query,
    };
    const data = await service.search(params);
    res.json(data);
  };
}

module.exports = search;
