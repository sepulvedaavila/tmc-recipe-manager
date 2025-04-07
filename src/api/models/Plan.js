const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  cliente: {
    type: Number,
    required: true
  },
  racion: {
    type: Number,
    required: true,
    default: 4
  },
  idPlan: {
    type: Number
  },
  nombrePlan: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', planSchema); 