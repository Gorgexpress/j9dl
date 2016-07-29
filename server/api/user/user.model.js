import mongoose from 'mongoose';

const authTypes = ['steam'];
const userSchema = new mongoose.Schema({
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


export default mongoose.model('User', userSchema);
