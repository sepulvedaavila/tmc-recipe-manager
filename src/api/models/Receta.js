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
required: true,
    index: true
  },
  fuente: {
    type: String,
    default: ''
  },
tipoPlatillo: {
    type: String,
    required: true,
    index: true
  },
  racion: {
    type: Number,
    required: true,
    default: 4
  },

  descripcion: {
    type: String,
    required: true
  },
tags: {
    type: [String],
    default: []
  },
  idReceta: {
    type: Number,
    sparse: true
  },
  ingredientes: [ingredienteSchema],
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

// Pre-save hook to update the updatedAt field
recetaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search
recetaSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Receta', recetaSchema, 'recetas');
