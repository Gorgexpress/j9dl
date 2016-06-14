var mongoose = require('mongoose');
var ratingSchema = new mongoose.Schema({
    id: {
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


module.exports = mongoose.model('User', userSchema);
