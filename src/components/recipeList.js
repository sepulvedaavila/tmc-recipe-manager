import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RecipeModal from './RecipeModal';
import { FiSearch, FiFilter, FiX, FiSliders } from 'react-icons/fi';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dishTypes: ['Sopa', 'Plato fuerte', 'Guarnicion'],
    minPortions: '',
    maxPortions: '',
    hasIngredients: false
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    async (term, sort, filterValues) => {
      try {
        setLoading(true);
        const params = {
          search: term,
          sortBy: sort.split(':')[0],
          sortOrder: sort.split(':')[1] || 'asc',
          minPortions: filterValues.minPortions || undefined,
          maxPortions: filterValues.maxPortions || undefined
        };

        const response = await axios.get('/api/recipes', { params });
        setRecipes(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm, sortBy, {
        minPortions: filters.minPortions,
        maxPortions: filters.maxPortions
      });
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy, filters, debouncedSearch]);

  // This function is currently unused since the Select component is commented out
  // const handleDishTypeChange = (selectedOptions) => {
  //   setFilters(prev => ({ ...prev, dishTypes: selectedOptions }));
  // };

  const handlePortionChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(prev => ({
      ...prev,
      minPortions: '',
      maxPortions: ''
    }));
    setSortBy('nombre');
  };

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-content">
      <div className="search-section bg-white rounded-xl shadow-sm mb-12 overflow-hidden">
        {/* Title and Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-3xl font-bold text-[#2d3748] mb-4">Recipes</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes by name, type, or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="styled-form input w-full pl-12 pr-12 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 focus:bg-white transition-all"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#28a745] w-5 h-5" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-[#28a745] hover:text-[#1e7e34] transition-colors p-1"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`submit-button flex items-center justify-center p-2 ${showFilters ? 'bg-[#1e7e34]' : 'bg-[#28a745]'} text-white rounded-lg hover:bg-[#1e7e34] transition-colors`}
              >
                <FiSliders className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="p-4 bg-[#f8f9fa] border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-[#28a745] mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="styled-form select w-full p-2.5 rounded-lg bg-white border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 transition-all text-gray-600"
                >
                  <option value="nombre:asc">Name (A-Z)</option>
                  <option value="nombre:desc">Name (Z-A)</option>
                  <option value="racion:asc">Portions (Lowest First)</option>
                  <option value="racion:desc">Portions (Highest First)</option>
                </select>
              </div>

              {/* Portions Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-[#28a745] mb-1">Portions Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="minPortions"
                    placeholder="Min"
                    value={filters.minPortions}
                    onChange={handlePortionChange}
                    className="styled-form input flex-1 p-2.5 rounded-lg bg-white border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 transition-all text-gray-600"
                    min="1"
                  />
                  <span className="text-[#28a745]">-</span>
                  <input
                    type="number"
                    name="maxPortions"
                    placeholder="Max"
                    value={filters.maxPortions}
                    onChange={handlePortionChange}
                    className="styled-form input flex-1 p-2.5 rounded-lg bg-white border border-gray-200 focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745] focus:ring-opacity-20 transition-all text-gray-600"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(filters.minPortions || filters.maxPortions || searchTerm) && (
          <div className="p-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#28a745]">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="filter-tag inline-flex items-center px-3 py-1 rounded-lg text-sm bg-[#28a745] text-white">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 hover:text-gray-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.minPortions && (
                <span className="filter-tag inline-flex items-center px-3 py-1 rounded-lg text-sm bg-[#28a745] text-white">
                  Min portions: {filters.minPortions}
                  <button
                    onClick={() => handlePortionChange({ target: { name: 'minPortions', value: '' } })}
                    className="ml-2 hover:text-gray-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.maxPortions && (
                <span className="filter-tag inline-flex items-center px-3 py-1 rounded-lg text-sm bg-[#28a745] text-white">
                  Max portions: {filters.maxPortions}
                  <button
                    onClick={() => handlePortionChange({ target: { name: 'maxPortions', value: '' } })}
                    className="ml-2 hover:text-gray-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="submit-button text-sm px-3 py-1 rounded-lg bg-[#dc3545] hover:bg-[#c82333] text-white transition-colors"
              >
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
          {recipes?.map(recipe => (
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