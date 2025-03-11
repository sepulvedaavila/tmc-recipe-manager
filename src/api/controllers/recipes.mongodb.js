const Recipe = require('../models/Recipe');

const getRecipes = async (req, res) => {
  try {
    const { search, sort, dishTypes, minPortions, maxPortions, hasIngredients } = req.query;

    // Build query
    const query = {};

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
      query.tipo_platillo = { $in: types };
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
    }

    // Build sort object
    let sortObj = { nombre: 1 }; // Default sort
    if (sort) {
      const [sortField, sortDirection] = sort.split(':');
      sortObj = { [sortField]: sortDirection === 'desc' ? -1 : 1 };
    }

    // Execute query
    const recipes = await Recipe.find(query).sort(sortObj);

    console.log(`Found ${recipes.length} recipes`);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      message: 'Error al obtener las recetas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const postRecipe = async (req, res) => {
  try {
    const receta = req.body;
    console.log('Creating new recipe:', receta);

    // Calculate por_persona for each ingredient
    const ingredientes = receta.ingredientes.map(ing => ({
      ...ing,
      por_persona: ing.cantidad / receta.racion,
      cantidad_total: ing.cantidad
    }));

    // Create new recipe document
    const newRecipe = new Recipe({
      nombre: receta.titulo,
      fuente: receta.fuente,
      tipo_platillo: receta.tipoPlatillo,
      racion: receta.racion,
      descripcion: receta.descripcion,
      tags: receta.tags,
      ingredientes: ingredientes
    });

    // Save the recipe
    await newRecipe.save();

    console.log('Recipe created:', newRecipe._id);
    res.json({ message: 'Receta guardada con éxito!' });
  } catch (error) {
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