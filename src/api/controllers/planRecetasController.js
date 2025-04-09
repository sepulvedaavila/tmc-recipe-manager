const PlanReceta = require('../models/PlanReceta');
const Plan = require('../models/Plan');
const Receta = require('../models/Receta');
const mongoose = require('mongoose');

// Get all recipe assignments for a plan
exports.getByPlanId = async (req, res) => {
  try {
    const { planId } = req.params;

    // Find the plan to get its idPlan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }

    // Find all plan-recipe assignments
    const planRecetas = await PlanReceta.find({ idPlan: plan.idPlan });

    // Get detailed recipe information for each assignment
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
          _id: planReceta._id,
          idPlan: planReceta.idPlan,
          idPlanReceta: planReceta.idPlanReceta,
          diaSemana: planReceta.diaSemana,
          idReceta: planReceta.idReceta,
          idSoup: planReceta.idSoup,
          idMain: planReceta.idMain,
          idSide: planReceta.idSide,
          receta: receta ? {
            _id: receta._id,
            nombre: receta.nombre,
            tipoPlatillo: receta.tipoPlatillo,
            descripcion: receta.descripcion
          } : null,
          soup: soup ? {
            _id: soup._id,
            nombre: soup.nombre,
            tipoPlatillo: soup.tipoPlatillo
          } : null,
          main: main ? {
            _id: main._id,
            nombre: main.nombre,
            tipoPlatillo: main.tipoPlatillo
          } : null,
          side: side ? {
            _id: side._id,
            nombre: side.nombre, 
            tipoPlatillo: side.tipoPlatillo
          } : null,
        };
      })
    );

    return res.status(200).json(detailedPlanRecetas);
  } catch (error) {
    console.error('Error fetching plan recipes:', error);
    return res.status(500).json({
      message: 'Error al obtener las recetas del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Get specific plan-recipe assignment
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the assignment
    const planReceta = await PlanReceta.findById(id);
    if (!planReceta) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
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

    return res.status(200).json({
      ...planReceta.toObject(),
      receta: receta ? receta.toObject() : null,
      soup: soup ? soup.toObject() : null,
      main: main ? main.toObject() : null,
      side: side ? side.toObject() : null
    });
  } catch (error) {
    console.error('Error fetching plan recipe:', error);
    return res.status(500).json({
      message: 'Error al obtener la receta del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Add recipe to plan
exports.create = async (req, res) => {
  try {
    const { planId } = req.params;
    const { idReceta, diaSemana, idSoup, idMain, idSide } = req.body;

    // Find the plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }

    // Check for existing assignment on the same day
    const existingAssignment = await PlanReceta.findOne({
      idPlan: plan.idPlan,
      diaSemana
    });

    if (existingAssignment) {
      // Update existing assignment
      existingAssignment.idReceta = idReceta;
      existingAssignment.idSoup = idSoup;
      existingAssignment.idMain = idMain;
      existingAssignment.idSide = idSide;
      existingAssignment.updatedAt = Date.now();

      await existingAssignment.save();

      return res.status(200).json({
        message: 'Receta actualizada en el plan',
        planRecetaId: existingAssignment._id
      });
    }

    // Create new assignment
    const newPlanReceta = new PlanReceta({
      idPlan: plan.idPlan,
      idReceta,
      diaSemana,
      idSoup,
      idMain,
      idSide
    });

    // Save to MongoDB
    const savedPlanReceta = await newPlanReceta.save();

    console.log('Recipe added to plan:', savedPlanReceta._id);

    return res.status(201).json({
      message: 'Receta añadida al plan con éxito',
      planRecetaId: savedPlanReceta._id
    });
  } catch (error) {
    console.error('Error adding recipe to plan:', error);
    return res.status(500).json({
      message: 'Error al añadir receta al plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Update plan-recipe assignment
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { idReceta, diaSemana, idSoup, idMain, idSide } = req.body;

    // Update assignment
    const updatedPlanReceta = await PlanReceta.findByIdAndUpdate(
      id,
      {
        $set: {
          idReceta,
          diaSemana,
          idSoup,
          idMain,
          idSide,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlanReceta) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    console.log('Plan recipe updated:', id);

    return res.status(200).json({
      message: 'Receta actualizada en el plan',
      planReceta: updatedPlanReceta
    });
  } catch (error) {
    console.error('Error updating plan recipe:', error);
    return res.status(500).json({
      message: 'Error al actualizar la receta del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Delete plan-recipe assignment
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlanReceta = await PlanReceta.findByIdAndDelete(id);

    if (!deletedPlanReceta) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    console.log('Plan recipe deleted:', id);

    return res.status(200).json({
      message: 'Receta eliminada del plan con éxito'
    });
  } catch (error) {
    console.error('Error deleting plan recipe:', error);
    return res.status(500).json({
      message: 'Error al eliminar la receta del plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};