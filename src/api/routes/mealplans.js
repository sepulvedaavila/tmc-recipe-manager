const express = require('express');
const router = express.Router();
const mealPlansController = require('../controllers/mealPlans.mongodb');

// GET /api/mealplans - Get weekly meal plan
router.get('/', mealPlansController.getWeeklyPlan);

// POST /api/mealplans - Add meal to plan
router.post('/', mealPlansController.addMealToPlan);

// DELETE /api/mealplans/:mealId - Delete meal from plan
router.delete('/:mealId', mealPlansController.deleteMealFromPlan);

// PUT /api/mealplans/:mealId - Update meal in plan
router.put('/:mealId', mealPlansController.updateMealInPlan);

module.exports = router;