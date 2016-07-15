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
      scriptPath: './matchmaking'
    }; 
    //sort both userids array and query results so they are n the same order
    userids = _.sortBy(userids);
    var query = Rating.find({'userid': { $in: userids}}, null, {sort:{userid:1}}).exec();

    return query
      .then(function (ratings) {
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
      })
      .catch(function (err) {
        console.log(err);
      });
  },

  rate: function(userids, rankings) {
    var options = {
      args: [rankings[0], rankings[1]],
      scriptPath: './matchmaking'
    }; 
    //every two numbers in our args array corresponds to a player's 
    //mu and sigma respectively.
    const sortedUserids = _.sortBy(userids);
    const loserOffset = userids.length / 2;
    var order = [];
    var query = Rating.find({'userid': { $in: sortedUserids}}, null, {sort:{userid:1}}).exec();
    var pythonPromise = query
      .then(function (ratings) {
        //every two numbers in our args array corresponds to a player's 
        //mu and sigma respectively. 
        _.each(sortedUserids, function (userid, index) {
          var rating = ratings[index];
          options.args.push(rating.mu);
          options.args.push(rating.sigma);
          order.push(userids.indexOf(userid));
        });
        return PythonShell.runAsync('recalculate_ratings.py', options);
      })
      .catch(function (err) {
        console.log(err);
      });
    
    return Promise.join(query, pythonPromise, function (ratings, results) {
      var newRatings = JSON.parse(results[0]);
        _.each(newRatings, function (rating, index) {
          ratings[order[index]].mu = rating.mu;
          ratings[order[index]].sigma = rating.sigma;
          ratings[order[index]].save();
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }
};
