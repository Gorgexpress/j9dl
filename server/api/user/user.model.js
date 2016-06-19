var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    id: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: Number,
      default: 0
    }
  });


module.exports = mongoose.model('User', userSchema);
