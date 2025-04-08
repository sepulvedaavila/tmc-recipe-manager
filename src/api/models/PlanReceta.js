const mongoose = require('mongoose');

const planRecetaSchema = new mongoose.Schema({
  idPlanReceta: {
type: Number,
    sparse: true
  },
  idPlan: {
    type: Number,
    required: true,
    index: true
  },
  idReceta: {
    type: Number,
    sparse: true
  },
  diaSemana: {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    required: true
  },
  idSoup: {
    type: Number,
    sparse: true
  },
  idMain: {
    type: Number,
    sparse: true
  },
  idSide: {
    type: Number,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create compound index for plan+day combination
planRecetaSchema.index({ idPlan: 1, diaSemana: 1 });
module.exports = mongoose.model('PlanReceta', planRecetaSchema, 'planRecetas');