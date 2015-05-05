var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TokenSchema   = new Schema({
  token: {
    type: String,
    // trim: true,
    // unique: true,
    // required: 'Email address is required',
    // validate: [validateEmail, 'Please fill a valid email address'],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  // _user: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Token', TokenSchema);
