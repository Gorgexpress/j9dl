var PythonShell = require('python-shell');

module.exports = {

  findBalancedTeams: function(players) {
    var options = {
      args: [30, 7, 40, 5, 60, 4, 25, 8]
    };

    PythonShell.run('test.py', options, function (err, results) {
      if(err) throw err;
      console.log('results: %j', results);
    });
  }
};
