//delAllIndexes
function delAllIndexes(services) {
  return async function(req, res) {
    let params = {
      key: req.body.key,
    };
    const data = await services.delAllIndexes(params);
    res.json(data);
  };
}

module.exports = delAllIndexes;
