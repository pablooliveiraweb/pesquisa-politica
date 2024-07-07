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
// routes/questionnaire.js



router.post('/', async (req, res) => {
  try {
    const { formData, responses } = req.body;
    const questionnaire = new Questionnaire({ formData, responses });
    await questionnaire.save();
    res.status(201).json({ message: 'Questionário salvo com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o questionário.' });
  }
});





module.exports = router;