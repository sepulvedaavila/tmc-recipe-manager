const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Import routes
const recetasRoutes = require('./routes/recetas');
const planesRoutes = require('./routes/planes');
const clientesRoutes = require('./routes/clientes');
const planRecetasRoutes = require('./routes/planRecetas');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS
app.use(cors({
  origin: '*', // In production, restrict to specific domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle OPTIONS requests for preflight
app.options('*', cors());

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/recipes', recetasRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/plan-recetas', planRecetasRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Diagnostic endpoint for debugging
app.get('/api/debug', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get collection information
    const collections = {};
    if (dbStatus === 'connected') {
      const Receta = require('./models/Receta');
      const Plan = require('./models/Plan');
      const Cliente = require('./models/Cliente');
      const PlanReceta = require('./models/PlanReceta');
      
      collections.recipes = await Receta.countDocuments();
      collections.plans = await Plan.countDocuments();
      collections.clients = await Cliente.countDocuments();
      collections.planRecipes = await PlanReceta.countDocuments();
    }
    
    res.status(200).json({
      api: {
        status: 'running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      },
      database: {
        status: dbStatus,
        mongodb_uri: process.env.MONGODB_URI ? '***set***' : 'not set',
        collections
      },
      system: {
        platform: process.platform,
        node_version: process.version,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
module.exports = app;