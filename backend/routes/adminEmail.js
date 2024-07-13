const express = require('express');
const router = express.Router();
const AdminEmail = require('../models/AdminEmail');

// Adicionar um novo email de admin
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const newEmail = new AdminEmail({ email });
    await newEmail.save();
    res.status(201).json(newEmail);
  } catch (error) {
    console.error('Error adding admin email:', error);
    res.status(500).json({ error: 'Error adding admin email' });
  }
});

// Listar todos os emails de admin
router.get('/', async (req, res) => {
  try {
    const emails = await AdminEmail.find({});
    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    res.status(500).json({ error: 'Error fetching admin emails' });
  }
});

// Excluir um email de admin
router.delete('/:id', async (req, res) => {
  try {
    await AdminEmail.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admin email deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin email:', error);
    res.status(500).json({ error: 'Error deleting admin email' });
  }
});

module.exports = router;
