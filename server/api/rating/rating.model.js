import mongoose from 'mongoose';
const ratingSchema = new mongoose.Schema({
    userid: {
      type: String
    },
    mu: {
      type: Number,
      default: 25
    },
    sigma: {
      type: Number,
      default: 8.3
    }
  });


export default mongoose.model('Rating', ratingSchema);
