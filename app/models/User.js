var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema   = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    // validate: [validateEmail, 'Please fill a valid email address'],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  passwordHash: String,
  token: String,
  _tokens: [{ type: String }],
});

module.exports = mongoose.model('User', UserSchema);
