const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
});

const questionSchema = new mongoose.Schema({
  text: String,
  options: [optionSchema],
  questionType: { type: String, enum: ['button', 'text'], default: 'button' }
});

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);
