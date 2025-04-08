const express = require('express');
const router = express.Router();
const planRecetasController = require('../controllers/planRecetasController');

// GET /api/plan-recetas/plan/:planId - Get all recipes for a plan
router.get('/plan/:planId', planRecetasController.getByPlanId);

// GET /api/plan-recetas/:id - Get a specific plan recipe
router.get('/:id', planRecetasController.getById);

// POST /api/plan-recetas/plan/:planId - Add recipe to plan
router.post('/plan/:planId', planRecetasController.create);

// PUT /api/plan-recetas/:id - Update plan recipe
router.put('/:id', planRecetasController.update);

// DELETE /api/plan-recetas/:id - Remove recipe from plan
router.delete('/:id', planRecetasController.delete);

module.exports = router;