var Rating = require('../rating/rating.model.js');
var _ = require('lodash');
var PythonShell = require('python-shell');
var Promise = require('bluebird');
var PythonShell = Promise.promisifyAll(require('python-shell'));

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

   var query = Rating.find({'userid': { $in: userids}}).exec();
    
    return query.then(function (ratings) {
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
      return PythonShell.runAsync('find_balanced_teams.py', options);
    })
    .then(function (results){
      var indices = JSON.parse(results[0]);
      var balancedPlayers = [];
      _.each(indices, function (index) {
        balancedPlayers.push(userids[index]);
      });
      return balancedPlayers;
    });
  }
};
