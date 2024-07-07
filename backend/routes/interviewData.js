const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');

router.get('/interview-data', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const interviewData = {};

    questionnaires.forEach((questionnaire) => {
      const neighborhood = questionnaire.formData.neighborhood;
      if (!interviewData[neighborhood]) {
        interviewData[neighborhood] = { count: 0, totalDuration: 0 };
      }
      interviewData[neighborhood].count += 1;
      interviewData[neighborhood].totalDuration += questionnaire.duration; // Certifique-se de que o campo 'duration' exista e esteja sendo salvo corretamente no modelo Questionnaire
    });

    const formattedData = Object.keys(interviewData).map(neighborhood => ({
      neighborhood,
      count: interviewData[neighborhood].count,
      totalDuration: interviewData[neighborhood].totalDuration
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching interview data:', error);
    res.status(500).json({ error: 'Error fetching interview data' });
  }
});

module.exports = router;
