const express = require('express');
const Questionnaire = require('../models/Questionnaire');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reports = await Questionnaire.find({});
    if (reports.length === 0) {
      res.status(200).send([
        {
          question: 'Se as eleições municipais fossem hoje em quem você votaria para Prefeito?',
          options: [
            { option: 'Dr. Danilo', percentage: 25 },
            { option: 'Ivelony', percentage: 20 },
            { option: 'Gabriel Ferrão', percentage: 15 },
            { option: 'Tião Leal', percentage: 10 },
            { option: 'Nem Raposão', percentage: 20 },
            { option: 'Romildo', percentage: 10 }
          ]
        }
      ]);
    } else {
      res.status(200).send(reports);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error generating report' });
  }
});

module.exports = router;
