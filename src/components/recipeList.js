import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RecipeModal from './RecipeModal';
import { FiSearch, FiFilter, FiX, FiSliders } from 'react-icons/fi';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dishTypes: ['Soup', 'Main Course', 'Side Dish'],
    minPortions: '',
    maxPortions: '',
    hasIngredients: false
  });

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Use absolute URL with window.location.origin to ensure correct API endpoint
        const apiUrl = `${window.location.origin}/api/recipes`;
        console.log('Fetching recipes from:', apiUrl);
        const response = await axios.get(apiUrl);
        console.log('Recipe API response:', response.data);
        
        // Handle both formats - either direct array or wrapped in recipeResult
        const recipeData = response.data.recipeResult || response.data;
        
        // Ensure we always have an array to work with
        if (Array.isArray(recipeData)) {
          setRecipes(recipeData);
        } else {
          console.error('API did not return an array:', response.data);
          setRecipes([]); // Set empty array to prevent filter errors
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on all search criteria with null safety
  const filteredRecipes = Array.isArray(recipes) 
    ? recipes.filter(recipe => {
        // Skip recipes with missing required fields
        if (!recipe || !recipe.nombre) return false;
        
        // Match by name (with null safety)
        const nameMatch = recipe.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Match by source with null safety
        const sourceMatch = !sourceSearch || (recipe.fuente && recipe.fuente.toLowerCase().includes(sourceSearch.toLowerCase()));
        
        // Match by ingredient with null safety
        const ingredientMatch = !ingredientSearch || (
          recipe.ingredientes && 
          Array.isArray(recipe.ingredientes) && 
          recipe.ingredientes.some(ing => 
            ing && ing.ingrediente && ing.ingrediente.toLowerCase().includes(ingredientSearch.toLowerCase())
          )
        );

        return nameMatch && sourceMatch && ingredientMatch;
      })
    : []; // Return empty array if recipes is not an array

  const clearFilters = () => {
    setSearchTerm('');
    setIngredientSearch('');
    setSourceSearch('');
  };

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-content p-8">
      <div className="search-section bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
        {/* Title and Main Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="page-title text-2xl font-bold text-gray-900 mb-6">
            Recipes
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-20 py-3 text-gray-900 text-base rounded-lg bg-gray-50 border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 focus:bg-white transition-all"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#28a745] w-5 h-5" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn btn-icon"
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                aria-label="Toggle filters"
              >
                <FiSliders className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Section */}
        {showFilters && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ingredient Search */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Search by Ingredient
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter ingredient name..."
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-gray-900 text-base rounded-lg bg-white border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 transition-all"
                  />
                  {ingredientSearch && (
                    <button
                      onClick={() => setIngredientSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Source Search */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Search by Source
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter recipe source..."
                    value={sourceSearch}
                    onChange={(e) => setSourceSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-gray-900 text-base rounded-lg bg-white border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 transition-all"
                  />
                  {sourceSearch && (
                    <button
                      onClick={() => setSourceSearch('')}
                      className="btn btn-icon absolute right-2 top-1/2 transform -translate-y-1/2"
                      aria-label="Clear source search"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchTerm || ingredientSearch || sourceSearch) && (
          <div className="p-4 flex items-center gap-3 flex-wrap bg-white border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="filter-tag">
                  Name: {searchTerm}
                  <button onClick={() => setSearchTerm('')}>
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {ingredientSearch && (
                <span className="filter-tag">
                  Ingredient: {ingredientSearch}
                  <button onClick={() => setIngredientSearch('')}>
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {sourceSearch && (
                <span className="filter-tag">
                  Source: {sourceSearch}
                  <button onClick={() => setSourceSearch('')}>
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="btn btn-danger"
              >
                <FiX className="w-4 h-4" />
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && (
        <div className="recipe-grid">
          {filteredRecipes.map(recipe => (
            <div 
              key={recipe.recipe_id} 
              className="recipe-card cursor-pointer transform hover:scale-102 hover:shadow-lg transition-all duration-300"
              onClick={() => {
                console.log('Recipe clicked:', recipe);
                setSelectedRecipe(recipe);
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedRecipe(recipe);
                }
              }}
            >
              <h3 className="text-xl font-bold text-[#2d3748] mb-3">{recipe.nombre}</h3>
              
              <div className="meta flex items-center gap-4 mb-4">
                <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {recipe.tipo_platillo || 'No type'}
                </span>
                <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {recipe.racion} portions
                </span>
              </div>

              {recipe.fuente && (
                <div className="source mb-3">
                  <span className="text-sm text-gray-500 italic">
                    Source: {recipe.fuente}
                  </span>
                </div>
              )}

              {recipe.descripcion && (
                <p className="description text-gray-700 mb-4 line-clamp-3">
                  {recipe.descripcion}
                </p>
              )}

              {recipe.ingredientes?.length > 0 && (
                <div className="ingredients bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Main Ingredients:</h4>
                  <ul className="list-disc list-inside">
                    {recipe.ingredientes.slice(0, 3).map((ing, index) => (
                      <li key={`${recipe.recipe_id}-${index}`} className="text-sm text-gray-600">
                        {ing.ingrediente}
                        {ing.cantidad_total > 0 && ` - ${ing.cantidad_total}${ing.unidad}`}
                      </li>
                    ))}
                    {recipe.ingredientes.length > 3 && (
                      <li className="text-sm text-gray-500 italic">
                        +{recipe.ingredientes.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show "No results" message when no recipes match the filters */}
      {!loading && filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No recipes found matching your search criteria</p>
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => {
            console.log('Closing modal');
            setSelectedRecipe(null);
          }} 
        />
      )}
    </div>
  );
};

export default RecipeList;