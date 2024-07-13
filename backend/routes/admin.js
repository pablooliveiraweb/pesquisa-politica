const express = require('express');
const User = require('../models/User');
const Admin = require('../models/Admin');

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching users' });
  }
});

router.put('/validate/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.validated = true;
    await user.save();
    res.status(200).send({ message: 'User validated' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error validating user' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting user' });
  }
});

// Atualizar email do administrador
router.put('/email', async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOneAndUpdate({}, { email }, { new: true, upsert: true });
    res.status(200).json({ message: 'Email atualizado com sucesso', admin });
  } catch (error) {
    console.error('Erro ao atualizar email do administrador:', error);
    res.status(500).json({ error: 'Erro ao atualizar email do administrador' });
  }
});

module.exports = router;
