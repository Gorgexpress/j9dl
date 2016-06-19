//temporary ratings object for testing. This needs to be moved into a database.
var ratings = {};
//initialize values for test ratings object. Will be deleted when moved into database
for (var i = 0; i < 50; i++) {
  ratings[i] = {
    mu: 50,
    sigma: 7
  };
}


module.exports = {
  get: function(userid) {
    return ratings[userid];
  },

  update: function(userid, newRating) {
    ratings[userid] = newRating;
  }
};
