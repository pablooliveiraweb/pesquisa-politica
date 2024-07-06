const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  neighborhood: { type: String, required: true },
  address: { type: String, required: true },
  ageRange: { type: String, required: true },
  gender: { type: String, required: true },
});

const questionnaireSchema = new mongoose.Schema({
  formData: { type: formDataSchema, required: true },
  responses: { type: [responseSchema], required: true },
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
