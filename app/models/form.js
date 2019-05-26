const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FormSchema = new Schema({
  formId: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  title: {
    type: String
  },
  questions: {
    type: Array
  },
  answers: {
    type: Array
  },
}, { collection: 'form', versionKey: false});

module.exports = mongoose.model('form', FormSchema);