const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  fuente: {
    type: String,
    required: true,
  },
  tipoPlatillo: {
    type: String,
    required: true,
  },
  racion: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  idReceta: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema); 