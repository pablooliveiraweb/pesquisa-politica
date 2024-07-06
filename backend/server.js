const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const questionnaireRoutes = require('./routes/questionnaire');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/token');
const Token = require('./models/Token');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = 'mongodb://localhost:27017/pesquisa';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
 
}).then(async () => {
  console.log('Connected to MongoDB');

  const existingToken = await Token.findOne();
  if (!existingToken) {
    const defaultTokenValue = uuidv4();
    const token = new Token({ value: defaultTokenValue });
    await token.save();
    console.log(`Generated default token: ${defaultTokenValue}`);
  }
}).catch((error) => {
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
app.use('/api/token', tokenRoutes);
app.use('/api/report', require('./routes/report')); // Adicione esta linha

// Middleware para verificar o token nas rotas de admin e relatório
app.use('/admin', verifyTokenMiddleware);
app.use('/report', verifyTokenMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
