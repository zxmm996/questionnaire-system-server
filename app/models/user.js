const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  account: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  tel: {
    type: String,
    require: true,
  },
}, { collection: 'user', versionKey: false});

module.exports = mongoose.model('user', UserSchema);