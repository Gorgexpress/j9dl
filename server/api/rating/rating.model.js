var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var ratingSchema = new mongoose.Schema({
    userid: {
      type: Number,
      default: 0
    },
    mu: {
      type: Number,
      default: 50
    },
    sigma: {
      type: Number,
      default: 5
    }
  });


module.exports = mongoose.model('Rating', ratingSchema);
