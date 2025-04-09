const Receta = require('../models/Receta');
const mongoose = require('mongoose');

// Get all recipes with optional filters
exports.getAll = async (req, res) => {
  try {
    // Build the MongoDB query
    const query = {
      $lookup: {
        from: "ingredientes",
        localField: "idReceta",
        foreignField: "idReceta",
        as: "ingredientes"
      }
    };

    // Execute query with explicit await and proper error handling
    console.log('MongoDB Query:', JSON.stringify(query));
    
    // Execute the query
    //const recetas = await Receta.find({query});
    const recetas = await Receta.aggregate([
      {
        $lookup: {
          from: "ingredientes",
          localField: "idReceta",
          foreignField: "idReceta",
          as: "ingredientes"
        }
      }
    ]);
    console.log(recetas);

    // Get total count for pagination info
    //const total = await Receta.countDocuments(query);

    //console.log(`Found ${recetas.length} recipes out of ${total} total`);
    
    // Format response to match what the frontend expects
    const formattedRecetas = recetas.map(recipe => ({
      recipe_id: recipe._id,
      nombre: recipe.nombre,
      fuente: recipe.fuente || '',
      racion: recipe.racion,
      tipo_platillo: recipe.tipoPlatillo,
      descripcion: recipe.descripcion,
      tags: recipe.tags || [],
      ingredientes: (recipe.ingredientes || []).map(ing => ({
        ingrediente: ing.ingrediente || 'Unknown',
        unidad: ing.unidad || '',
        por_persona: ing.por_persona || 0,
        cantidad_total: ing.cantidad_total || 0
      }))
    }));

    // Return in the format expected by the frontend
    return res.status(200).json({ 
      recipeResult: formattedRecetas,
      pagination: {
        //total,
        //page: parseInt(page),
        //limit: parseInt(limit),
        //pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las recetas',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get recipe by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid MongoDB ID format: ${id}`);
      return res.status(400).json({ 
        message: 'ID de receta inválido',
        error: 'Invalid MongoDB ID format'
      });
    }

    // Use findById with error handling
    const receta = await Receta.findById(id).lean();

    if (!receta) {
      console.warn(`Recipe not found with ID: ${id}`);
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    console.log(`Recipe found: ${receta.nombre}`);

    // Format response
    const formattedReceta = {
      recipe_id: receta._id,
      nombre: receta.nombre,
      fuente: receta.fuente || '',
      racion: receta.racion,
      tipo_platillo: receta.tipoPlatillo,
      descripcion: receta.descripcion,
      tags: receta.tags || [],
      ingredientes: (receta.ingredientes || []).map(ing => ({
        ingrediente: ing.ingrediente || 'Unknown',
        unidad: ing.unidad || '',
        por_persona: parseFloat(ing.por_persona) || 0,
        cantidad_total: parseFloat(ing.cantidad_total) || 0
      }))
    };

    return res.status(200).json(formattedReceta);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return res.status(500).json({
      message: 'Error al obtener la receta',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Create new recipe
exports.create = async (req, res) => {
  try {
    const receta = req.body;
    console.log('Creating new recipe:', JSON.stringify(receta));

    // Validate required fields
    if (!receta.titulo && !receta.nombre) {
      return res.status(400).json({ 
        message: 'Nombre de receta requerido',
        error: 'Missing required field: nombre/titulo'
      });
    }

    if (!receta.tipoPlatillo) {
      return res.status(400).json({ 
        message: 'Tipo de platillo requerido',
        error: 'Missing required field: tipoPlatillo'
      });
    }

    if (!receta.descripcion) {
      return res.status(400).json({ 
        message: 'Descripción requerida',
        error: 'Missing required field: descripcion'
      });
    }

    // Prepare ingredients with per-person calculations
    const ingredientes = Array.isArray(receta.ingredientes) 
      ? receta.ingredientes.map(ing => ({
          ingrediente: ing.ingrediente,
          unidad: ing.unidad || '',
          // Use the correct field names that match your collection
          por_persona: ing.cantidad / (receta.racion || 4),
          cantidad_total: ing.cantidad
        }))
      : [];

    // Create new recipe document
    const newReceta = new Receta({
      nombre: receta.titulo || receta.nombre,
      fuente: receta.fuente || '',
      tipoPlatillo: receta.tipoPlatillo,
      racion: receta.racion || 4,
      descripcion: receta.descripcion,
      tags: receta.tags || [],
      ingredientes: ingredientes
    });

    // Save to MongoDB with explicit error handling
    try {
      const savedReceta = await newReceta.save();
      console.log('Recipe created successfully:', savedReceta._id);
      
      return res.status(201).json({ 
        message: 'Receta guardada con éxito!',
        recipeId: savedReceta._id 
      });
    } catch (saveError) {
      console.error('Error saving to MongoDB:', saveError);
      return res.status(500).json({
        message: 'Error al guardar la receta en la base de datos',
        error: process.env.NODE_ENV === 'development' ? saveError.message : 'Database error'
      });
    }
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({
      message: 'Error al crear la receta',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Update recipe
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prepare ingredients if updated
    if (updates.ingredientes && updates.racion) {
      updates.ingredientes = updates.ingredientes.map(ing => ({
        ingrediente: ing.ingrediente,
        unidad: ing.unidad || '',
        por_persona: ing.cantidad / updates.racion,
        cantidad_total: ing.cantidad
      }));
    }

    // Update recipe document
    const updatedReceta = await Receta.findByIdAndUpdate(
      id,
      { 
        $set: {
          ...updates,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedReceta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    console.log('Recipe updated:', id);
    
    return res.status(200).json({ 
      message: 'Receta actualizada con éxito!',
      recipe: updatedReceta
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return res.status(500).json({
      message: 'Error al actualizar la receta',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Delete recipe
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReceta = await Receta.findByIdAndDelete(id);

    if (!deletedReceta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    console.log('Recipe deleted:', id);
    
    return res.status(200).json({ 
      message: 'Receta eliminada con éxito!'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return res.status(500).json({
      message: 'Error al eliminar la receta',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};