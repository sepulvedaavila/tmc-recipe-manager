const express = require('express');
const router = express.Router();
const { 
    getPlanes, 
    getPlanById, 
    createPlan, 
    updatePlan, 
    deletePlan,
    addRecipeToPlan,
    removeRecipeFromPlan
} = require('../controllers/planes.mongodb');

// Get all plans
router.get('/', getPlanes);

// Get a specific plan by ID
router.get('/:id', getPlanById);

// Create a new plan
router.post('/', createPlan);

// Update a plan
router.put('/:id', updatePlan);

// Delete a plan
router.delete('/:id', deletePlan);

// Add recipe to plan
router.post('/:planId/recipes/:recipeId', addRecipeToPlan);

// Remove recipe from plan
router.delete('/:planId/recipes/:recipeId', removeRecipeFromPlan);

module.exports = router; 