const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const questionnaireRoutes = require('./routes/questionnaire');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/token');
const emailRoutes = require('./routes/adminEmail'); // Certifique-se de que o caminho esteja correto
const resetRoutes = require('./routes/reset');
const Token = require('./models/Token');
const Email = require('./models/AdminEmail'); // Certifique-se de que o caminho esteja correto
const { v4: uuidv4 } = require('uuid');
const Questionnaire = require('./models/Questionnaire');
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5001;
 const MONGO_URI = 'mongodb://localhost:27017/pesquisa';
//const MONGO_URI = 'mongodb://pesquisa:c2s26EcWsbWmCkS7@127.0.0.1:27017/pesquisa';

// Email padrão fixo
const FIXED_EMAIL = 'producaoinove@gmail.com';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {})
  .then(async () => {
    console.log('Connected to MongoDB');

    const existingToken = await Token.findOne();
    if (!existingToken) {
      const defaultTokenValue = uuidv4();
      const token = new Token({ value: defaultTokenValue });
      await token.save();
      console.log(`Generated default token: ${defaultTokenValue}`);
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const verifyTokenMiddleware = async (req, res, next) => {
  const token = req.query.token || req.params.token;
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const existingToken = await Token.findOne({ value: token });
  if (!existingToken) {
    return res.status(401).send({ message: 'Invalid token.' });
  }

  next();
};

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/report', require('./routes/report'));

// Rota para obter dados das entrevistas
app.get('/api/interview-data', async (req, res) => {
  try {
    const interviewData = await Questionnaire.aggregate([
      {
        $group: {
          _id: '$formData.neighborhood',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
        },
      },
      {
        $project: {
          neighborhood: '$_id',
          count: 1,
          totalDuration: 1,
        },
      },
    ]);

    res.json(interviewData);
  } catch (error) {
    console.error('Error fetching interview data:', error);
    res.status(500).json({ error: 'Error fetching interview data' });
  }
});

// Middleware para verificar o token nas rotas de admin e relatório
app.use('/admin', verifyTokenMiddleware);
app.use('/report', verifyTokenMiddleware);

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
    from: 'Token Sistema Pesquisa <token@chatcontroll.com>', // O mesmo que o user no transporter
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
}

// Agendamento para geração de token a cada 24 horas (para teste, configure para 1 minuto)
nodeCron.schedule('0 0 * * *', async () => {
  try {
    // Invalida os tokens existentes
    await Token.deleteMany({});

    // Gera um novo token
    const tokenValue = uuidv4();
    const newToken = new Token({ value: tokenValue });
    await newToken.save();

    // Envia email para o email fixo e para todos os administradores
    const emails = await Email.find({});
    for (const email of emails) {
      await sendEmail(email.email, tokenValue);
    }

    await sendEmail(FIXED_EMAIL, tokenValue); // Envia para o email fixo

    console.log(`Generated and emailed new token: ${tokenValue}`);
  } catch (error) {
    console.error('Error during token renewal:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
