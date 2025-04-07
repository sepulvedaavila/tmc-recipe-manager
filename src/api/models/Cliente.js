const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  telefono: {
    type: String
  },
  email: {
    type: String
  },
  comentarios: {
    type: String
  },
  idCliente: {
    type: Number
  }
});

module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');