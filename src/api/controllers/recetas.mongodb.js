const Receta = require('../models/Receta');

const getRecipes = async (req, res, next) => {
    const { search, sort, dishTypes, minPortions, maxPortions, hasIngredients } = req.query;

    try {
        // Build MongoDB query object (equivalent to WHERE clauses)
        const query = {
          $lookup:{
                from: "ingredientes",
                localField: "idReceta",
                foreignField: "idReceta",
                as: "ingredientes"
              }
        };

        // Search filter
        if (search) {
            query.$or = [
                { nombre: { $regex: search, $options: 'i' } },
                { descripcion: { $regex: search, $options: 'i' } }
            ];
        }

        // Dish type filter
        if (dishTypes) {
            const types = dishTypes.split(',');
            query.tipoPlatillo = { $in: types };
        }

        // Portion range filter
        if (minPortions || maxPortions) {
            query.racion = {};
            if (minPortions) query.racion.$gte = parseInt(minPortions);
            if (maxPortions) query.racion.$lte = parseInt(maxPortions);
        }

        // Complete ingredients filter
        if (hasIngredients === 'true') {
            query['ingredientes.0'] = { $exists: true };
            query['ingredientes.ingrediente'] = { $ne: null };
            query['ingredientes.unidad'] = { $ne: null };
            query['ingredientes.cantidad_total'] = { $ne: null };
        }

        // Build sort object
        let sortObj = { nombre: 1 }; // Default sort is by name ascending
        
        if (sort) {
            const [sortField, sortDirection] = sort.split(':');
            sortObj = { [sortField]: sortDirection === 'desc' ? -1 : 1 };
        }

        // Execute the query with mongoose
        const recipeResult = await Receta.find(query).sort(sortObj);

        // Format the response
        const formattedRecipes = recipeResult.map(recipe => {
            // Convert Mongoose document to plain object
            const recipeObj = recipe.toObject();
            
            // Ensure ingredients array is properly formatted
            if (!recipeObj.ingredientes) {
                recipeObj.ingredientes = [];
            }
            
            return {
                recipe_id: recipeObj._id,
                nombre: recipeObj.nombre,
                fuente: recipeObj.fuente,
                racion: recipeObj.racion,
                tipo_platillo: recipeObj.tipoPlatillo,
                descripcion: recipeObj.descripcion,
                ingredientes: recipeObj.ingredientes.map(ing => ({
                    ingrediente: ing.ingrediente || 'Unknown',
                    unidad: ing.unidad || '',
                    por_persona: parseFloat(ing.por_persona) || 0,
                    cantidad_total: parseFloat(ing.cantidad_total) || 0
                }))
            };
        });

        // Log successful response
        console.log(`Found ${formattedRecipes.length} recipes`);
        
        // Return in the format expected by the frontend (which was used with MySQL)
        // The frontend expects { recipeResult: [...] }
        res.json({ recipeResult: formattedRecipes });
    } catch (error) {
        // Detailed error logging
        console.error('Error fetching recipes:', error);
        
        // Send appropriate error response
        res.status(500).json({
            message: 'Error al obtener las recetas',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const postRecipe = async (req, res, next) => {
    const receta = req.body;

    try {
        // Log the request
        console.log('Creating new recipe:', receta);

        // Prepare ingredients with per-person calculations
        const ingredientes = receta.ingredientes.map(ing => ({
            ingrediente: ing.ingrediente,
            unidad: ing.unidad,
            por_persona: ing.cantidad / receta.racion, // Calculate "por_persona"
            cantidad_total: ing.cantidad
        }));

        // Create new recipe document
        const newReceta = new Receta({
            nombre: receta.titulo,
            fuente: receta.fuente,
            tipoPlatillo: receta.tipoPlatillo,
            racion: receta.racion,
            descripcion: receta.descripcion,
            tags: receta.tags,
            ingredientes: ingredientes
        });

        // Save to MongoDB
        const savedRecipe = await newReceta.save();

        // Log successful creation
        console.log('Recipe created:', savedRecipe._id);
        
        res.json({ 
            message: 'Receta guardada con éxito!',
            recipeId: savedRecipe._id 
        });
    } catch (error) {
        // Detailed error logging
        console.error('Error creating recipe:', error);

        res.status(500).json({
            message: 'Error al crear la receta',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    postRecipe,
    getRecipes
}; 