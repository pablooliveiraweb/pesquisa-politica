const mongoose = require('mongoose');

const QuestionnaireSchema = new mongoose.Schema({
  formData: {
    name: { type: String, required: true },
    neighborhood: { type: String, required: true },
    address: { type: String, required: true },
    ageRange: { type: String, required: true },
    gender: { type: String, required: true }
  },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);
