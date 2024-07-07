const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  question: String,
  answer: String,
  duration: Number, // Adicionando o campo de duração para cada resposta
});

const formDataSchema = new mongoose.Schema({
  name: String,
  neighborhood: String,
  address: String,
  ageRange: String,
});

const questionnaireSchema = new mongoose.Schema({
  formData: formDataSchema,
  responses: [responseSchema],
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
