const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  cliente: {
    type: Number,
    required: true,
    index: true
  },
  racion: {
    type: Number,
    required: true,
    default: 4
  },
  idPlan: {
    type: Number,
    sparse: true
  },
  nombrePlan: {
    type: String,
    required: true,
    index: true
  },
  fechaCreacion: {
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
planSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plan', planSchema, 'planes');