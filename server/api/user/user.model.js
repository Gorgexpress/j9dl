var mongoose = require('mongoose');

const authTypes = ['steam'];
var userSchema = new mongoose.Schema({
    createdAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: Number,
      default: 0
    },
    password: {
      type: String,
      required: function () {
        if (authTypes.indexOf(this.provider) === -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    provider: String,
    steam: {}
  });


module.exports = mongoose.model('User', userSchema);
