const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 50
   },
  email: {
     type: String, 
     required: true,
     unique: true, 
     match:/.+\@.+\..+/
    },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // maxlength: 24
    },
  role:{type: String,
    enum: ['user','admin'],
    default: 'user'
  }

});

module.exports = mongoose.model('User', userSchema);
