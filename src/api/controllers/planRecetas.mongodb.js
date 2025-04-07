const PlanReceta = require('../models/PlanReceta');
const Plan = require('../models/Plan');
const Receta = require('../models/Receta');

// Get all recipes for a specific plan
const getPlanRecetas = async (req, res) => {
  const { planId } = req.params;
  
  try {
    // Convert planId to the matching idPlan value
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }
    
    // Find all planRecetas with matching idPlan
    const planRecetas = await PlanReceta.find({ idPlan: plan.idPlan });
    
    // Get full recipe details for each plan recipe
    const detailedPlanRecetas = await Promise.all(
      planRecetas.map(async (planReceta) => {
        // Get recipe details
        let receta = null;
        if (planReceta.idReceta) {
          receta = await Receta.findOne({ idReceta: planReceta.idReceta });
        }
        
        // Get soup details
        let soup = null;
        if (planReceta.idSoup) {
          soup = await Receta.findOne({ idReceta: planReceta.idSoup });
        }
        
        // Get main dish details
        let main = null;
        if (planReceta.idMain) {
          main = await Receta.findOne({ idReceta: planReceta.idMain });
        }
        
        // Get side dish details
        let side = null;
        if (planReceta.idSide) {
          side = await Receta.findOne({ idReceta: planReceta.idSide });
        }
        
        return {
          ...planReceta.toObject(),
          receta: receta ? receta.toObject() : null,
          soup: soup ? soup.toObject() : null,
          main: main ? main.toObject() : null,
          side: side ? side.toObject() : null,
        };
      })
    );
    
    res.json(detailedPlanRecetas);
  } catch (error) {
    console.error('Error fetching plan recipes:', error);
    res.status(500).json({
      message: 'Error al obtener las recetas del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a specific plan recipe
const getPlanRecetaById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const planReceta = await PlanReceta.findById(id);
    
    if (!planReceta) {
      return res.status(404).json({ message: 'Receta de plan no encontrada' });
    }
    
    // Get associated recipes
    let receta = null;
    if (planReceta.idReceta) {
      receta = await Receta.findOne({ idReceta: planReceta.idReceta });
    }
    
    let soup = null;
    if (planReceta.idSoup) {
      soup = await Receta.findOne({ idReceta: planReceta.idSoup });
    }
    
    let main = null;
    if (planReceta.idMain) {
      main = await Receta.findOne({ idReceta: planReceta.idMain });
    }
    
    let side = null;
    if (planReceta.idSide) {
      side = await Receta.findOne({ idReceta: planReceta.idSide });
    }
    
    res.json({
      ...planReceta.toObject(),
      receta: receta ? receta.toObject() : null,
      soup: soup ? soup.toObject() : null,
      main: main ? main.toObject() : null,
      side: side ? side.toObject() : null,
    });
  } catch (error) {
    console.error('Error fetching plan recipe:', error);
    res.status(500).json({
      message: 'Error al obtener la receta del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add a recipe to a plan
const addRecetaToPlan = async (req, res) => {
  const { planId } = req.params;
  const { idReceta, diaSemana, idSoup, idMain, idSide } = req.body;
  
  try {
    // Find the plan to get the plan ID number
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }
    
    // Create a new plan recipe entry
    const newPlanReceta = new PlanReceta({
      idPlan: plan.idPlan,
      idReceta,
      diaSemana,
      idSoup,
      idMain,
      idSide
    });
    
    // Save the new plan recipe
    const savedPlanReceta = await newPlanReceta.save();
    
    console.log('Plan recipe added:', savedPlanReceta._id);
    res.status(201).json({
      message: 'Receta añadida al plan con éxito',
      planRecetaId: savedPlanReceta._id
    });
  } catch (error) {
    console.error('Error adding recipe to plan:', error);
    res.status(500).json({
      message: 'Error al añadir receta al plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a plan recipe
const updatePlanReceta = async (req, res) => {
  const { id } = req.params;
  const { idReceta, diaSemana, idSoup, idMain, idSide } = req.body;
  
  try {
    const updatedPlanReceta = await PlanReceta.findByIdAndUpdate(
      id,
      {
        idReceta,
        diaSemana,
        idSoup,
        idMain,
        idSide
      },
      { new: true }
    );
    
    if (!updatedPlanReceta) {
      return res.status(404).json({ message: 'Receta de plan no encontrada' });
    }
    
    console.log('Plan recipe updated:', id);
    res.json({
      message: 'Receta de plan actualizada con éxito',
      planReceta: updatedPlanReceta
    });
  } catch (error) {
    console.error('Error updating plan recipe:', error);
    res.status(500).json({
      message: 'Error al actualizar la receta del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a plan recipe
const deletePlanReceta = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedPlanReceta = await PlanReceta.findByIdAndDelete(id);
    
    if (!deletedPlanReceta) {
      return res.status(404).json({ message: 'Receta de plan no encontrada' });
    }
    
    console.log('Plan recipe deleted:', id);
    res.json({ message: 'Receta eliminada del plan con éxito' });
  } catch (error) {
    console.error('Error deleting plan recipe:', error);
    res.status(500).json({
      message: 'Error al eliminar la receta del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getPlanRecetas,
  getPlanRecetaById,
  addRecetaToPlan,
  updatePlanReceta,
  deletePlanReceta
};