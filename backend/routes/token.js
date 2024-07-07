const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const { v4: uuidv4 } = require('uuid');

// Rota para gerar novo token
router.post('/', async (req, res) => {
  try {
    const newToken = new Token({ value: uuidv4() });
    await newToken.save();
    res.status(201).json(newToken);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Error generating token' });
  }
});

// Rota para verificar token
router.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const existingToken = await Token.findOne({ value: token });
    if (existingToken) {
      res.status(200).json({ valid: true });
    } else {
      res.status(404).json({ valid: false });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Error verifying token' });
  }
});

// Rota para excluir token
router.delete('/:id', async (req, res) => {
  try {
    await Token.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Token deleted successfully' });
  } catch (error) {
    console.error('Error deleting token:', error);
    res.status(500).json({ error: 'Error deleting token' });
  }
});

// Rota para buscar todos os tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.find({});
    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Error fetching tokens' });
  }
});

module.exports = router;
