
function deleteDocs(service) {
  return async function(req, res) {

    const params = {
      url: req.body.url,
      features: req.body.features,
    };
    const data = await service.deleteDocs(params);

    res.json(data);
  };
}

module.exports = deleteDocs;
