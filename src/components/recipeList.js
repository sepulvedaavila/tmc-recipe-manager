// client/src/components/RecipeList.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('./api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="main-content">
      <h2>Recipes</h2>
      <Link to="/new-recipe" className="btn btn-primary">
        New Recipe
      </Link>
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <div key={recipe._id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;