import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';
import MealPlanModal from './MealPlanModal';

const MealPlanList = () => {
    const [mealPlans, setMealPlans] = useState([]);
    //const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const fetchMealPlans = async () => {
            try {
                setLoading(true);
                const [plansResponse, recipesResponse] = await Promise.all([
                    fetch('/api/planes'),
                    fetch('/api/recipes')
                ]);
                
                const [plansData, recipesData] = await Promise.all([
                    plansResponse.json(),
                    recipesResponse.json()
                ]);

                console.log('Recipes Data:', recipesData);

                // Create a map of recipes for quick lookup
                const recipesMap = new Map((recipesData.recipeResult || []).map(recipe => [recipe.recipe_id, recipe]));

                // Enhance plans with full recipe details
                const enhancedPlans = (plansData.planResult || []).map(plan => {
                    // Transform recetas array into comidas array with full recipe details
                    const comidas = plan.recetas.map(receta => ({
                        dia: receta.dia_semana,
                        tipo_comida: 'Comida', // Default value or you can map based on your needs
                        receta: recipesMap.get(receta.idSoup) || recipesMap.get(receta.idMain) || recipesMap.get(receta.idSide)
                    })).filter(comida => comida.receta); // Filter out meals without recipes

                    return {
                        plan_id: plan.id_plan,
                        nombre: plan.nombre_plan,
                        duracion: plan.recetas.length, // Number of days based on recipes
                        racion: plan.racion,
                        comidas: comidas
                    };
                });

                console.log('Enhanced Plans:', enhancedPlans); // Debug log
                setMealPlans(enhancedPlans);
                //setRecipes(recipesData);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching meal plans:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, []);

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="main-content">
            <div className="search-section bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
                {/* Title Section */}
                <div className="p-6 border-b border-gray-100">
                    <h1 className="page-title">
                        Meal Plans
                    </h1>
                </div>
            </div>

            {loading ? (
                <div className="meal-plan-grid">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="meal-plan-grid">
                    {mealPlans.map(plan => (
                        <div
                            key={plan.plan_id}
                            className="card-meal-plan cursor-pointer"
                            onClick={() => setSelectedPlan(plan)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedPlan(plan);
                                }
                            }}
                        >
                            <div className="meal-plan-header p-6">
                                <h3 className="meal-plan-title">{plan.nombre}</h3>
                                <div className="meal-plan-meta mt-2">
                                    <span className="inline-flex items-center text-gray-600 mr-4">
                                        <FiCalendar className="w-4 h-4 mr-1" />
                                        {plan.duracion} days
                                    </span>
                                    <span className="inline-flex items-center text-gray-600">
                                        <FiClock className="w-4 h-4 mr-1" />
                                        {plan.comidas?.length || 0} meals
                                    </span>
                                </div>
                            </div>

                            <div className="meal-plan-content p-6 border-t border-gray-100">
                                <div className="space-y-3">
                                    {plan.comidas?.slice(0, 3).map((meal, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div>
                                                <span className="text-sm text-gray-500">{meal.dia}</span>
                                                <p className="text-gray-900">{meal.receta?.nombre || 'Loading...'}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{meal.tipo_comida}</span>
                                        </div>
                                    ))}
                                    {plan.comidas?.length > 3 && (
                                        <p className="text-sm text-gray-500 italic">
                                            +{plan.comidas.length - 3} more meals...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPlan && (
                <MealPlanModal
                    mealPlan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                />
            )}
        </div>
    );
};

export default MealPlanList; 