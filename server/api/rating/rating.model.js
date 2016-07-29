var mongoose = require('mongoose');
var ratingSchema = new mongoose.Schema({
    userid: {
      type: String
    },
    mu: {
      type: Number,
      default: 25
    },
    sigma: {
      type: Number,
      default: 8
    }
  });


module.exports = mongoose.model('Rating', ratingSchema);
