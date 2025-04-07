const Plan = require('../models/Plan');
const Receta = require('../models/Receta');

const getPlanes = async (req, res, next) => {
    try {
        // Get all plans from MongoDB
        const planes = await Plan.find({}).sort({ nombrePlan: 1 });
        
        console.log(`Found ${planes.length} plans`);
        res.json(planes);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            message: 'Error al obtener los planes',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getPlanById = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        // Find plan by ID in MongoDB
        const plan = await Plan.findById(id);
        
        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        
        // Get recipes associated with this plan
        const recetas = await Receta.find({ plan: plan._id });
        
        res.json({
            ...plan.toObject(),
            recetas
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({
            message: 'Error al obtener el plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const createPlan = async (req, res, next) => {
    const planData = req.body;
    
    try {
        // Create new plan in MongoDB
        const newPlan = new Plan({
            cliente: planData.cliente || 1,
            racion: planData.racion || 4,
            nombrePlan: planData.nombrePlan,
            fechaCreacion: new Date()
        });
        
        const savedPlan = await newPlan.save();
        
        console.log('Plan created:', savedPlan._id);
        res.status(201).json({
            message: 'Plan creado con éxito',
            planId: savedPlan._id
        });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({
            message: 'Error al crear el plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const updatePlan = async (req, res, next) => {
    const { id } = req.params;
    const planData = req.body;
    
    try {
        // Update plan in MongoDB
        const updatedPlan = await Plan.findByIdAndUpdate(
            id, 
            {
                cliente: planData.cliente,
                racion: planData.racion,
                nombrePlan: planData.nombrePlan
            },
            { new: true }
        );
        
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        
        console.log('Plan updated:', id);
        res.json({
            message: 'Plan actualizado con éxito',
            plan: updatedPlan
        });
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({
            message: 'Error al actualizar el plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const deletePlan = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        // First, update any recipes that reference this plan to remove the reference
        await Receta.updateMany(
            { plan: id },
            { $set: { plan: null } }
        );
        
        // Then delete the plan
        const deletedPlan = await Plan.findByIdAndDelete(id);
        
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        
        console.log('Plan deleted:', id);
        res.json({ message: 'Plan eliminado con éxito' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({
            message: 'Error al eliminar el plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const addRecipeToPlan = async (req, res, next) => {
    const { planId, recipeId } = req.params;
    
    try {
        // Check if plan exists
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        
        // Check if recipe exists
        const recipe = await Receta.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }
        
        // Update recipe to associate with plan
        recipe.plan = planId;
        await recipe.save();
        
        console.log(`Recipe ${recipeId} added to plan ${planId}`);
        res.json({ message: 'Receta añadida al plan con éxito' });
    } catch (error) {
        console.error('Error adding recipe to plan:', error);
        res.status(500).json({
            message: 'Error al añadir receta al plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const removeRecipeFromPlan = async (req, res, next) => {
    const { planId, recipeId } = req.params;
    
    try {
        // Update recipe to remove plan association
        const recipe = await Receta.findByIdAndUpdate(
            recipeId,
            { $set: { plan: null } },
            { new: true }
        );
        
        if (!recipe) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }
        
        console.log(`Recipe ${recipeId} removed from plan ${planId}`);
        res.json({ message: 'Receta eliminada del plan con éxito' });
    } catch (error) {
        console.error('Error removing recipe from plan:', error);
        res.status(500).json({
            message: 'Error al eliminar receta del plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    addRecipeToPlan,
    removeRecipeFromPlan
}; 