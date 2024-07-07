const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');

router.delete('/', async (req, res) => {
  try {
    // Deleta todos os documentos na coleção de Questionnaires e Questions
    await Questionnaire.deleteMany({});
    await Question.deleteMany({});
    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Error resetting database' });
  }
});

module.exports = router;
