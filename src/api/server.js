const express = require('express');
const cors = require('cors');
const connectDB = require('./db/mongodb');
const recetasRoutes = require('./routes/recetas');
const planesRoutes = require('./routes/planes');

//const recetas = require('./recetas').default;
//const consts = require('./api/consts').default;

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recetasRoutes);
app.use('/api/planes', planesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;