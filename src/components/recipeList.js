// src/components/RecipeList.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="recipe-grid">
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <img src={recipe.image || '/placeholder-food.jpg'} alt={recipe.title} />
          <h3>{recipe.title}</h3>
          <div className="recipe-meta">
            <span>⏲ {recipe.cooking_time} mins</span>
            <span>🍴 {recipe.servings} servings</span>
          </div>
          <div className="recipe-tags">
            {recipe.tags?.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
