const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');

// Rota para obter todas as respostas do questionário
router.get('/', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para salvar as respostas do questionário
router.post('/', async (req, res) => {
  const questionnaire = new Questionnaire({
    formData: req.body.formData,
    responses: req.body.responses
  });

  try {
    const newQuestionnaire = await questionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para enviar as respostas do questionário
router.post('/', async (req, res) => {
  const { formData, responses } = req.body;

  try {
    const newQuestionnaire = new Questionnaire({ formData, responses });
    await newQuestionnaire.save();
    res.status(201).send({ message: 'Questionnaire responses saved successfully' });
  } catch (error) {
    console.error('Error saving questionnaire responses:', error);
    res.status(500).send({ error: 'Failed to save questionnaire responses' });
  }
});

module.exports = router;
