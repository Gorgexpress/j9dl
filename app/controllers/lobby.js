var lobbies = [];
lobbies.push("APEM pros only");
lobbies.push("ARDM"); 
module.exports = {
  list: function(req, res, next) {
    res.send(JSON.stringify(lobbies));
  },

  create: function(req, res, next) {
    lobbies.push(req.params.name)
    res.send({});
  }
};
