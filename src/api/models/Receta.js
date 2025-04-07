const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema({
  ingrediente: {
    type: String,
    required: true
  },
  unidad: {
    type: String,
    default: ''
  },
  por_persona: {
    type: Number,
    default: 0
  },
  cantidad_total: {
    type: Number,
    default: 0
  }
});

const recetaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  fuente: {
    type: String,
    default: ''
  },
  racion: {
    type: Number,
    required: true,
    default: 4
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: null
  },
  tags: {
    type: String,
    default: ''
  },
  descripcion: {
    type: String,
    required: true
  },
  idReceta: {
    type: Number
  },
  tipoPlatillo: {
    type: String,
    required: true
  },
  ingredientes: [ingredienteSchema]
});

module.exports = mongoose.model('Receta', recetaSchema); 