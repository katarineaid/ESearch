//createSomeDocs

function createSomeDocs(service) {
  return async function(req, res) {

    const params = {
      url: req.body.url,
      features: req.body.features,
    };
    const data = await service.createSomeDocs(params);

    res.json(data);
  };
}

module.exports = createSomeDocs;
