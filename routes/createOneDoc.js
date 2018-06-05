function createOneDoc(service) {
  return async function(req, res) {

    const params = {
      url: req.body.url,
      feature: req.body.feature,
    };
    const data = await service.createOneDoc(params);

    res.json(data);
  };
}

module.exports = createOneDoc;
