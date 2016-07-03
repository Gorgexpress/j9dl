var Rating = require('../rating/rating.model.js');
var _ = require('lodash');
var PythonShell = require('python-shell');

module.exports = {
  get: function(userid) {
    return ratings[userid];
  },

  update: function(userid, newRating) {
    ratings[userid] = newRating;
  },

  findBalancedTeams: function(userids) {
    var options = {
      args: [],
      scriptPath: './server/components/matchmaking'
    }; 

    return Rating.find({
      'userid': { $in: userids}
    }).then(function (err, ratings) {
      //every two numbers in our args array corresponds to a player's 
      //mu and sigma respectively. 
      _.each(userids, function (userid, index) {
        var rating = ratings[index];
        if (!rating) {
          rating = new Rating({'userid': userid});
          rating.save();
        }
        options.args.push(rating.mu);
        options.args.push(rating.sigma);
      });
      var indices = [];

      PythonShell.run('find_balanced_teams.py', options, function (err, results) {
        if(err) throw err;
        indices = JSON.parse(results[0]);
        var balancedPlayers = [];
        _.each(indices, function (index) {
          balancedPlayers.push(userids[index]);
        });
        return balancedPlayers;
      });
    });
  }
};
