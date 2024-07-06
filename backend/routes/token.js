const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Token = require('../models/Token');

// Gerar novo token
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

// Obter todos os tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.find();
    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Error fetching tokens' });
  }
});

// Excluir um token
router.delete('/:id', async (req, res) => {
  try {
    const tokenId = req.params.id;
    await Token.findByIdAndDelete(tokenId);
    res.status(200).json({ message: 'Token deleted successfully' });
  } catch (error) {
    console.error('Error deleting token:', error);
    res.status(500).json({ error: 'Error deleting token' });
  }
});

// Verificar um token
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const existingToken = await Token.findOne({ value: token });
    if (existingToken) {
      res.status(200).json({ message: 'Token is valid' });
    } else {
      res.status(404).json({ message: 'Token not found' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Error verifying token' });
  }
});

module.exports = router;
