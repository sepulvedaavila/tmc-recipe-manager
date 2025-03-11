const MealPlan = require('../models/MealPlan');

// Helper function to get current week
const getCurrentWeek = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  return startOfWeek.toISOString().split('T')[0];
};

const getWeeklyPlan = async (req, res) => {
  try {
    const weeklyPlan = await MealPlan.findOne({
      userId: req.user.id,
      week: getCurrentWeek()
    }).populate('meals.recipeId');

    res.json(weeklyPlan || {});
  } catch (error) {
    console.error('Error fetching weekly plan:', error);
    res.status(500).json({ error: 'Error al obtener el plan semanal' });
  }
};

const addMealToPlan = async (req, res) => {
  try {
    const { day, mealType, recipeId, name } = req.body;
    const week = getCurrentWeek();

    // Find or create the meal plan for the current week
    let mealPlan = await MealPlan.findOne({
      userId: req.user.id,
      week: week
    });

    if (!mealPlan) {
      mealPlan = new MealPlan({
        userId: req.user.id,
        week: week,
        meals: []
      });
    }

    // Add the new meal
    mealPlan.meals.push({
      day,
      type: mealType,
      recipeId,
      name
    });

    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (error) {
    console.error('Error adding meal to plan:', error);
    res.status(500).json({ error: 'Error al agregar la comida al plan' });
  }
};

const deleteMealFromPlan = async (req, res) => {
  try {
    const { mealId } = req.params;
    const week = getCurrentWeek();

    const mealPlan = await MealPlan.findOne({
      userId: req.user.id,
      week: week
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    mealPlan.meals = mealPlan.meals.filter(
      meal => meal._id.toString() !== mealId
    );

    await mealPlan.save();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meal from plan:', error);
    res.status(500).json({ error: 'Error al eliminar la comida del plan' });
  }
};

const updateMealInPlan = async (req, res) => {
  try {
    const { mealId } = req.params;
    const updateData = req.body;
    const week = getCurrentWeek();

    const mealPlan = await MealPlan.findOne({
      userId: req.user.id,
      week: week
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    const mealIndex = mealPlan.meals.findIndex(
      meal => meal._id.toString() === mealId
    );

    if (mealIndex === -1) {
      return res.status(404).json({ error: 'Comida no encontrada' });
    }

    // Update the meal
    Object.assign(mealPlan.meals[mealIndex], updateData);
    await mealPlan.save();

    res.json(mealPlan.meals[mealIndex]);
  } catch (error) {
    console.error('Error updating meal in plan:', error);
    res.status(500).json({ error: 'Error al actualizar la comida en el plan' });
  }
};

module.exports = {
  getWeeklyPlan,
  addMealToPlan,
  deleteMealFromPlan,
  updateMealInPlan
}; 