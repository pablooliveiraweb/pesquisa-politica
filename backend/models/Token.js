const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  value: { type: String, required: true }
});

module.exports = mongoose.model('Token', tokenSchema);
