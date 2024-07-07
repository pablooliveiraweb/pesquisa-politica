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
      totalRespondents++;
      if (questionnaire.formData && questionnaire.formData.neighborhood) {
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
    let totalRespondents = 0;

    questionnaires.forEach((questionnaire) => {
      totalRespondents++;
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
    });

    res.json({ report: ageRangeReport, totalRespondents });
  } catch (error) {
    console.error('Error fetching age range report:', error);
    res.status(500).json({ error: 'Error fetching age range report' });
  }
});

router.get('/addresses', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const addressReport = {};

    questionnaires.forEach((questionnaire) => {
      if (questionnaire.formData && questionnaire.formData.address) {
        const address = questionnaire.formData.address;
        const name = questionnaire.formData.name;
        const neighborhood = questionnaire.formData.neighborhood;
        const firstResponse = questionnaire.responses[0]; // Assuming the first question is the target

        if (firstResponse) {
          const answer = firstResponse.answer;

          if (!addressReport[answer]) {
            addressReport[answer] = [];
          }

          addressReport[answer].push({
            name: name,
            neighborhood: neighborhood,
            address: address,
            answer: answer
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

router.get('/interview-data', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    const interviewData = {};

    questionnaires.forEach((questionnaire) => {
      const { neighborhood, startTime, endTime } = questionnaire.formData;
      if (!interviewData[neighborhood]) {
        interviewData[neighborhood] = {
          count: 0,
          totalDuration: 0,
        };
      }

      const duration = (new Date(endTime) - new Date(startTime)) / 1000; // Duration in seconds
      interviewData[neighborhood].count += 1;
      interviewData[neighborhood].totalDuration += duration;
    });

    res.json(interviewData);
  } catch (error) {
    console.error('Error fetching interview data:', error);
    res.status(500).json({ error: 'Error fetching interview data' });
  }
});


module.exports = router;
