const mongoose = require('mongoose');

const planRecetaSchema = new mongoose.Schema({
  idPlanReceta: {
    type: Number
  },
  idPlan: {
    type: Number,
    required: true
  },
  idReceta: {
    type: Number
  },
  diaSemana: {
    type: String
  },
  idSoup: {
    type: Number
  },
  idMain: {
    type: Number
  },
  idSide: {
    type: Number
  }
});

module.exports = mongoose.model('PlanReceta', planRecetaSchema, 'planRecetas');