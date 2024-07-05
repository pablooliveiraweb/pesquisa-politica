const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const { v4: uuidv4 } = require('uuid');

// Rota para gerar um novo token
router.post('/generate', async (req, res) => {
  const newTokenValue = uuidv4();
  try {
    const token = new Token({ value: newTokenValue });
    await token.save();
    res.status(201).send({ token: newTokenValue });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send({ error: 'Failed to generate token' });
  }
});

// Rota para verificar o token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const existingToken = await Token.findOne({ value: token });
    if (existingToken) {
      res.status(200).send({ valid: true });
    } else {
      res.status(404).send({ valid: false });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).send({ error: 'Failed to verify token' });
  }
});

// Rota para trocar o token
router.post('/change', async (req, res) => {
  const { newToken } = req.body;
  try {
    await Token.deleteMany({});
    const token = new Token({ value: newToken });
    await token.save();
    res.status(200).send({ message: 'Token changed successfully' });
  } catch (error) {
    console.error('Error changing token:', error);
    res.status(500).send({ error: 'Failed to change token' });
  }
});

module.exports = router;
