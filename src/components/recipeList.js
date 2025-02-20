import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dishTypes: ['Sopa', 'Plato fuerte', 'Guarnicion'],
    minPortions: '',
    maxPortions: '',
    hasIngredients: false
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const params = {
          search: searchTerm,
          sort: sortBy
        };

        // Corrected API endpoint URL
        const response = await axios.get('/api/recipes', { params });

        // Directly use response.data since backend returns formatted array
        setRecipes(response.data);

      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchTerm, sortBy, filters]);

  const handleDishTypeChange = (selectedOptions) => {
    setFilters(prev => ({ ...prev, dishTypes: selectedOptions }));
  };

  const handlePortionChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-content">
      <h2>Recipes</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="nombre:asc">Name (A-Z)</option>
          <option value="nombre:desc">Name (Z-A)</option>
          <option value="racion:asc">Portions (Lowest First)</option>
          <option value="racion:desc">Portions (Highest First)</option>
        </select>
        {/*
        <div className="filter-group">
          <label>Dish Types:</label>
          <Select
            isMulti
            options={dishTypes.map(type => ({ value: type, label: type }))}
            onChange={handleDishTypeChange}
            value={filters.dishTypes}
            className="filter-select"
          />
        </div>
        */}
        <div className="filter-group">
          <label>Portions:</label>
          <div className="portion-range">
            <input
              type="number"
              name="minPortions"
              placeholder="Min"
              value={filters.minPortions}
              onChange={handlePortionChange}
            />
            <span>-</span>
            <input
              type="number"
              name="maxPortions"
              placeholder="Max"
              value={filters.maxPortions}
              onChange={handlePortionChange}
            />
          </div>
        </div>

        <Link to="/new-recipe" className="btn btn-primary">
          New Recipe
        </Link>
      </div>

      <div className="recipe-grid">
        {recipes?.map(recipe => (
          <div key={recipe.recipe_id} className="recipe-card">
            <h3>{recipe.nombre}</h3>
            <div className="meta">
              <span>🍽️ {recipe.tipo_platillo || 'No type specified'}</span>
              <span>👥 {recipe.racion} portions</span>
            </div>

            {recipe.fuente && (
              <div className="source">
                <small>Source: {recipe.fuente}</small>
              </div>
            )}

            {recipe.descripcion && (
              <p className="description">
                {recipe.descripcion.substring(0, 100)}...
              </p>
            )}

            {/* Safe ingredient handling */}
            {(recipe.ingredientes?.length > 0) && (
              <div className="ingredients">
                <h4>Main Ingredients:</h4>
                <ul>
                  {recipe.ingredientes.slice(0, 3).map((ing, index) => (
                    <li key={`${recipe.recipe_id}-${index}`}>
                      {ing.ingrediente}
                      {/* Safe number display */}
                      {ing.cantidad_total > 0 && ` - ${ing.cantidad_total}${ing.unidad}`}
                      {ing.por_persona > 0 && ` (${ing.por_persona} per person)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;