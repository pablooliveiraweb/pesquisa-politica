const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch users' });
  }
});

// Validar usuário
router.put('/:id/validate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { validated: true }, { new: true });
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: 'Failed to validate user' });
  }
});

// Excluir usuário
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete user' });
  }
});

module.exports = router;
