const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// Criar uma nova pergunta
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating question' });
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

// Adicionar uma opção a uma pergunta específica
router.put('/:id/add-option', async (req, res) => {
  try {
    const { text } = req.body;
    const question = await Question.findById(req.params.id);
    question.options.push({ text });
    await question.save();
    res.status(200).send(question);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding option to question' });
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
