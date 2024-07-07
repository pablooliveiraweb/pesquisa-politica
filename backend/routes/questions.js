const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// Rota para criar uma nova pergunta
router.post('/', async (req, res) => {
  const { text, type } = req.body;

  const placeholder = type === 'text' ? 'Digite aqui sua resposta' : '';

  const question = new Question({
    text,
    type,
    placeholder,
  });

  try {
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Rota para buscar todas as perguntas
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Server Error');
  }
});

/// Adicionar opções a uma pergunta
router.post('/:id/options', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).send('Pergunta não encontrada');
    }
    const newOptions = req.body.options.map(option => ({ value: option }));
    question.options.push(...newOptions);
    await question.save();
    res.status(200).send(question);
  } catch (error) {
    res.status(400).send('Erro ao adicionar opções');
  }
});

// Atualizar uma pergunta
router.put('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(question);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating question' });
  }
});

// Deletar uma pergunta
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting question' });
  }
});

module.exports = router;