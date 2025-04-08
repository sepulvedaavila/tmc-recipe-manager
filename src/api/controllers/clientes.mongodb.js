const Cliente = require('../models/Cliente');

// Get all clients
const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find({}).sort({ nombre: 1 });
    console.log(`Found ${clientes.length} clients`);
    res.json(clientes);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      message: 'Error al obtener los clientes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get client by id
const getClienteById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const cliente = await Cliente.findById(id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      message: 'Error al obtener el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new client
const createCliente = async (req, res) => {
  const clienteData = req.body;
  
  try {
    const newCliente = new Cliente({
      nombre: clienteData.nombre,
      telefono: clienteData.telefono || '',
      email: clienteData.email || '',
      comentarios: clienteData.comentarios || '',
      idCliente: clienteData.idCliente
    });
    
    const savedCliente = await newCliente.save();
    
    console.log('Client created:', savedCliente._id);
    res.status(201).json({
      message: 'Cliente creado con éxito',
      clienteId: savedCliente._id
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      message: 'Error al crear el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update client
const updateCliente = async (req, res) => {
  const { id } = req.params;
  const clienteData = req.body;
  
  try {
    const updatedCliente = await Cliente.findByIdAndUpdate(
      id, 
      {
        nombre: clienteData.nombre,
        telefono: clienteData.telefono,
        email: clienteData.email,
        comentarios: clienteData.comentarios
      },
      { new: true }
    );
    
    if (!updatedCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    console.log('Client updated:', id);
    res.json({
      message: 'Cliente actualizado con éxito',
      cliente: updatedCliente
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({
      message: 'Error al actualizar el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete client
const deleteCliente = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedCliente = await Cliente.findByIdAndDelete(id);
    
    if (!deletedCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    console.log('Client deleted:', id);
    res.json({ message: 'Cliente eliminado con éxito' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      message: 'Error al eliminar el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};