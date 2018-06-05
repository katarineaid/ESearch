function createFromServices(services) {
  return async function(req, res) {
    const data = await services.createFromServices('params');
    res.json(data);
  };
}

module.exports = createFromServices;
