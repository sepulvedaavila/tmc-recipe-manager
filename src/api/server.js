const express = require('express');
const cors = require('cors');
const connectDB = require('./db/mongodb');
const recetasRoutes = require('./routes/recetas');
const planesRoutes = require('./routes/planes');
const clientesRoutes = require('./routes/clientes');
const mealPlansRoutes = require('./routes/mealplans');
const planRecetasRoutes = require('./routes/planRecetas');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*', // Allow any origin for API access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/recipes', recetasRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/mealplans', mealPlansRoutes);
app.use('/api/plan-recetas', planRecetasRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});


// Explicit recipes endpoint for testing
app.get('/test-recipes', async (req, res) => {
  try {
    const Receta = require('./models/Receta');
    const recipeResult = await Receta.find({}).limit(10);
    const count = await Receta.countDocuments();
    
    res.status(200).json({ 
      message: 'Test recipes endpoint',
      count,
      recipeResult: recipeResult.map(r => r.toObject()) 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error in test recipes endpoint', 
      error: error.message 
    });
  }

// Debug endpoint to show all registered routes
app.get('/api/debug/routes', (req, res) => {
  // Get all registered routes
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods),
            baseUrl: middleware.regexp.toString()
          });
        }
      });
    }
  });
  
  res.status(200).json({
    routes: routes,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: PORT,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set'
    }
  });

});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;