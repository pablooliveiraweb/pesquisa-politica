const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');
const Token = require('../models/Token');
const User = require('../models/User');

router.delete('/', async (req, res) => {
  try {
    // Deleta todos os documentos nas coleções
    await Questionnaire.deleteMany({});
    await Question.deleteMany({});
    
    

    // Recria um token padrão para garantir que haja um token disponível
    const defaultTokenValue = 'default-token-value';
    const token = new Token({ value: defaultTokenValue });
    await token.save();

    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Error resetting database' });
  }
});

module.exports = router;
