const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const Email = require('../models/AdminEmail');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Servidor SMTP da Hostinger
  port: 587, // Porta SMTP (pode ser 465 para SSL)
  secure: false, // true para port 465, false para outras portas
  auth: {
    user: 'token@chatcontroll.com', // Substitua pelo seu email na Hostinger
    pass: 'Cpu031191*' // Substitua pela sua senha do email
  }
});

// Função para enviar email com layout HTML
const sendEmail = async (email, tokenValue) => {
  const mailOptions = {
    from: 'token@chatcontroll.com', // O mesmo que o user no transporter
    to: email,
    subject: 'Um novo token de acesso foi gerado',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
        <div style="display: inline-block; text-align: left; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Um novo token de acesso foi gerado</h2>
          <p style="color: #555;">Para acessar o painel admin, use o link abaixo:</p>
          <a href="http://vota.chatcontroll.com/admin/${tokenValue}" style="display: block; margin: 20px 0; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Acessar Painel Admin</a>
          <p style="color: #555;">Para acessar o relatório, use o link abaixo:</p>
          <a href="http://vota.chatcontroll.com/report/${tokenValue}" style="display: block; margin: 20px 0; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Acessar Relatório</a>
          <p style="color: #777;">Token: <strong style="color: #000;">${tokenValue}</strong></p>
          <p style="color: #777;">Este token é válido por 24 horas.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

// Rota para gerar novo token
router.post('/', async (req, res) => {
  try {
    const tokenValue = uuidv4();
    const newToken = new Token({ value: tokenValue });
    await newToken.save();

    // Enviar email para todos os administradores
    const emails = await Email.find({});
    for (const email of emails) {
      await sendEmail(email.email, tokenValue);
    }

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
