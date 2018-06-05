function createDocuments(services) {
  return async function(req, res) {
    const data = await services.createDocuments('params');
    res.json(data);
  };
}

module.exports = createDocuments;
