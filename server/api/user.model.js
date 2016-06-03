module.exports = function(db){
  var userNames = {};
  var userSchema = db.Schema({
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
  var User = db.model('User', userSchema);

  return {
    getUserName: function(id) {
      return userNames[id];
    }
  };
};
