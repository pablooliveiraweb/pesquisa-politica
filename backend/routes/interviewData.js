const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');

router.get('/', async (req, res) => {
  try {
    const interviewData = await Interview.aggregate([
      {
        $group: {
          _id: "$neighborhood",
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          ageGroups: { $push: "$ageGroup" }
        }
      }
    ]);

    res.json(interviewData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview data' });
  }
});

module.exports = router;
