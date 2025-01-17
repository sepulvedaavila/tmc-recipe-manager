const express = require('express');
const recipeController  = require('../controllers/recetas');

const recipesRouter = express.Router();

recipesRouter.get('/', recipeController.getRecipes);
recipesRouter.post('/', recipeController.postRecipe);

module.exports = recipesRouter;
