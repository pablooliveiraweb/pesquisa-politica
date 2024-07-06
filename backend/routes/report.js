const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');

router.get('/general', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const generalReport = {};
    let totalRespondents = 0;

    questionnaires.forEach((questionnaire) => {
      totalRespondents++;
      questionnaire.responses.forEach((response) => {
        const question = response.question;
        const answer = response.answer;

        if (!generalReport[question]) {
          generalReport[question] = {};
        }

        if (!generalReport[question][answer]) {
          generalReport[question][answer] = 0;
        }

        generalReport[question][answer] += 1;
      });
    });

    res.json({ report: generalReport, totalRespondents });
  } catch (error) {
    console.error('Error fetching general report:', error);
    res.status(500).json({ error: 'Error fetching general report' });
  }
});

router.get('/by-neighborhood', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const neighborhoodReports = {};
    let totalRespondents = 0;

    questionnaires.forEach((questionnaire) => {
      if (questionnaire.formData && questionnaire.formData.neighborhood) {
        totalRespondents++;
        const neighborhood = questionnaire.formData.neighborhood;
        const firstResponse = questionnaire.responses[0]; // Assuming the first question is the target

        if (firstResponse) {
          const answer = firstResponse.answer;

          if (!neighborhoodReports[neighborhood]) {
            neighborhoodReports[neighborhood] = {};
          }

          if (!neighborhoodReports[neighborhood][answer]) {
            neighborhoodReports[neighborhood][answer] = 0;
          }

          neighborhoodReports[neighborhood][answer] += 1;
        }
      }
    });

    res.json({ report: neighborhoodReports, totalRespondents });
  } catch (error) {
    console.error('Error fetching neighborhood report:', error);
    res.status(500).json({ error: 'Error fetching neighborhood report' });
  }
});

router.get('/age-range', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const ageRangeReport = {};

    questionnaires.forEach((questionnaire) => {
      if (questionnaire.formData && questionnaire.formData.ageRange) {
        const ageRange = questionnaire.formData.ageRange;
        const firstResponse = questionnaire.responses[0]; // Assuming the first question is the target

        if (!ageRangeReport[ageRange]) {
          ageRangeReport[ageRange] = {};
        }

        if (firstResponse) {
          const answer = firstResponse.answer;

          if (!ageRangeReport[ageRange][answer]) {
            ageRangeReport[ageRange][answer] = 0;
          }

          ageRangeReport[ageRange][answer] += 1;
        }
      }
    });

    res.json({ report: ageRangeReport });
  } catch (error) {
    console.error('Error fetching age range report:', error);
    res.status(500).json({ error: 'Error fetching age range report' });
  }
});

router.get('/addresses', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const addressReport = [];

    questionnaires.forEach((questionnaire) => {
      if (questionnaire.formData && questionnaire.formData.address) {
        const address = questionnaire.formData.address;
        const neighborhood = questionnaire.formData.neighborhood; // Adicionando o bairro ao relatório
        const firstResponse = questionnaire.responses[0]; // Assuming the first question is the target

        if (firstResponse) {
          addressReport.push({
            neighborhood: neighborhood, // Incluindo o bairro
            address: address,
            answer: firstResponse.answer
          });
        }
      }
    });

    res.json({ report: addressReport });
  } catch (error) {
    console.error('Error fetching address report:', error);
    res.status(500).json({ error: 'Error fetching address report' });
  }
});

module.exports = router;
