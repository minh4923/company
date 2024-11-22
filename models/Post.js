const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:{
      type: String,
      minlength: 1, 
      maxlength: 30,
      required: true
  } ,
  content: {
      type: String, 
      minlength: 1,
      maxlength: 6000,
      required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
