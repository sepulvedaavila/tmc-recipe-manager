import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './recipeCard';


const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('./api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        
        console.log('API Response:', data);
        
        // Check if we have recipeResult (MySQL format) or direct array (MongoDB format)
        const recipeData = data.recipeResult || data;
        
        const recipesArray = recipeData.map((recipe) => {
          return { 
            id: recipe.recipe_id, 
            nombre: recipe.nombre, 
            descripcion: recipe.descripcion, 
            racion: recipe.racion, 
            tags: recipe.tags,
            tipo_platillo: recipe.tipo_platillo,
            fuente: recipe.fuente,
            ingredientes: recipe.ingredientes || []
          };
        });
        console.log('Processed recipes:', recipesArray);
        setRecipes(recipesArray);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchRecipes();
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;

  return (
    <div>
      <h2>Recetas</h2>
      <Link to="/nueva-receta">
        <button className="primary-button">Nueva Receta</button>
      </Link>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Recipes;