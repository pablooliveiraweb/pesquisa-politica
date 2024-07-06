const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  value: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, required: true },
  options: [optionSchema],
  placeholder: { type: String, default: '' }  // Novo campo adicionado
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
