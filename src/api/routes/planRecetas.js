const express = require('express');
const router = express.Router();
const planRecetasController = require('../controllers/planRecetas.mongodb');

// GET /api/plan-recetas/plan/:planId - Get all recipes for a plan
router.get('/plan/:planId', planRecetasController.getPlanRecetas);

// GET /api/plan-recetas/:id - Get a specific plan recipe
router.get('/:id', planRecetasController.getPlanRecetaById);

// POST /api/plan-recetas/plan/:planId - Add a recipe to a plan
router.post('/plan/:planId', planRecetasController.addRecetaToPlan);

// PUT /api/plan-recetas/:id - Update a plan recipe
router.put('/:id', planRecetasController.updatePlanReceta);

// DELETE /api/plan-recetas/:id - Delete a plan recipe
router.delete('/:id', planRecetasController.deletePlanReceta);

module.exports = router;