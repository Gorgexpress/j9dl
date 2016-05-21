var data = require('../../config/data.js');

module.exports = {
  list: function(req, res, next) {
    res.send(JSON.stringify(data.lobbies));
  },

  create: function(req, res, next) {
    data.lobbies.push(req.params.name)
    res.send({});
  }
};
