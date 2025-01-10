// FILE: Recetas.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
  
    useEffect(() => {
      const fetchRecipes = async () => {
        const response = await fetch('/api/recetas');
        const data = await response.json();
        setRecipes(data);
      };
  
      fetchRecipes();
    }, []);
  
    return (
      <div>
        <h2>Recipes</h2>
        <Link to="/nueva-receta">
          <button className="primary-button">Nueva Receta</button>
        </Link>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.nombre}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Recipes;