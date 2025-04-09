const express = require('express');
const cors = require('cors');
// Use the correct path for the database connection
const { connectDB, getConnectionStatus } = require('./db/mongodb');
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
(async () => {
  try {
    await connectDB();
    console.log('MongoDB connection initialized in server.js');
  } catch (err) {
    console.error('Failed to connect to MongoDB in server.js:', err);
  }
})();

// Configure CORS - essential for Vercel deployment
app.use(cors({
  origin: '*', // Allow any origin for API access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours CORS cache
}));

// Handle OPTIONS requests for preflight explicitly - critical for browser API calls
app.options('*', cors());

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to help debug API requests, especially in Vercel
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  // For Vercel, check request headers that might be important
  console.log('Origin:', req.get('origin'));
  console.log('Host:', req.get('host'));
  // Continue processing
  next();
});

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
    // Check MongoDB connection using our helper function
    const connectionStatus = getConnectionStatus();
    
    // Get collection information
    const collections = {};
    if (connectionStatus.readyState === 1) {
      try {
        const Receta = require('./models/Receta');
        collections.recipes = await Receta.countDocuments();
        // Sample a recipe to verify schema connection
        const sampleRecipe = await Receta.findOne().lean();
        collections.sampleRecipeFields = sampleRecipe 
          ? Object.keys(sampleRecipe)
          : [];
      } catch (err) {
        console.error('Error counting recipes:', err);
        collections.recipesError = err.message;
      }
      
      try {
        const Plan = require('./models/Plan');
        collections.plans = await Plan.countDocuments();
      } catch (err) {
        console.error('Error counting plans:', err);
        collections.plansError = err.message;
      }
      
      try {
        const Cliente = require('./models/Cliente');
        collections.clients = await Cliente.countDocuments();
      } catch (err) {
        console.error('Error counting clients:', err);
        collections.clientsError = err.message;
      }
      
      try {
        const PlanReceta = require('./models/PlanReceta');
        collections.planRecipes = await PlanReceta.countDocuments();
      } catch (err) {
        console.error('Error counting plan recipes:', err);
        collections.planRecipesError = err.message;
      }
    }
    
    // Get detailed MongoDB info
    let detailedDbInfo = {};
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.db) {
        // Get database stats
        detailedDbInfo = await mongoose.connection.db.stats();
      }
    } catch (err) {
      console.error('Error getting DB stats:', err);
      detailedDbInfo = { error: err.message };
    }
    
    res.status(200).json({
      api: {
        status: 'running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      },
      database: {
        connection: connectionStatus,
        mongodb_uri: process.env.MONGODB_URI ? '***set***' : 'not set',
        collections,
        stats: detailedDbInfo
      },
      system: {
        platform: process.platform,
        node_version: process.version,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Add a specific recipes diagnostic endpoint
app.get('/api/recipes-debug', async (req, res) => {
  try {
    const Receta = require('./models/Receta');
    
    // Attempt to get total count
    const count = await Receta.countDocuments();
    
    // Get sample recipes to verify structure
    const sampleRecipes = await Receta.find().limit(2).lean();
    
    // Get collection info
    const mongoose = require('mongoose');
    const collectionInfo = await mongoose.connection.db
      .collection('recetas')
      .stats();
    
    res.status(200).json({
      total_recipes: count,
      sample_recipes: sampleRecipes,
      collection_info: collectionInfo
    });
  } catch (error) {
    console.error('Error in recipes debug endpoint:', error);
    res.status(500).json({ 
      message: 'Error accessing recipes',
      error: error.message
    });
  }
});

// Catch all for undefined routes
app.use('/{*any}', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3001;
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