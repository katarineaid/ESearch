function createTable(services) {
  return async function(req, res) {
    const data = await services.createTable('params');
    res.json(data);
  };
}

module.exports = createTable;
