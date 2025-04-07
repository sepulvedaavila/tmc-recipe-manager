const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.mongodb');

// GET /api/clientes - Get all clients
router.get('/', clientesController.getClientes);

// GET /api/clientes/:id - Get client by ID
router.get('/:id', clientesController.getClienteById);

// POST /api/clientes - Create a new client
router.post('/', clientesController.createCliente);

// PUT /api/clientes/:id - Update client
router.put('/:id', clientesController.updateCliente);

// DELETE /api/clientes/:id - Delete client
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;