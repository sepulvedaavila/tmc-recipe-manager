const express = require('express');
const router = express.Router();
const { getRecipes, postRecipe } = require('../controllers/recetas.mongodb');

// Get all recipes with optional filters
router.get('/', getRecipes);

// Create a new recipe
router.post('/', postRecipe);

module.exports = router; 