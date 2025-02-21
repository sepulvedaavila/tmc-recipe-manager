import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card-components';
import { FiCalendar, FiUser, FiUsers, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Planes = () => {
    const [plans, setPlans] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [plansResponse, recipesResponse] = await Promise.all([
                    fetch('/api/plans'),
                    fetch('/api/recipes')
                ]);

                const plansData = await plansResponse.json();
                const recipesData = await recipesResponse.json();

                const recipeMap = recipesData.reduce((acc, recipe) => {
                    acc[recipe.recipe_id] = recipe.nombre;
                    return acc;
                }, {});

                setRecipes(recipeMap);
                setPlans(plansData.planResult);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error al cargar los planes');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3c4c42]"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 p-4 text-center">
            {error}
        </div>
    );

    return (
        <div className="meal-plans-container">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-arsenal text-[#3c4c42]">Planes de Comida</h1>
                    
                </div>

                <div className="meal-plan-grid">
                    {plans.map((plan) => (
                        <Card 
                            key={plan.id_plan} 
                            className="card-meal-plan"
                        >
                            <CardHeader className="meal-plan-header">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-arsenal text-[#3c4c42] mb-2">
                                            {plan.nombre_plan}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-3 text-sm text-[#5c6861]">
                                            <span className="flex items-center gap-1">
                                                <FiUser className="w-4 h-4" />
                                                {plan.cliente}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiUsers className="w-4 h-4" />
                                                {plan.racion} personas
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="w-4 h-4" />
                                                {new Date(plan.fecha_creacion).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <FiEdit2 className="w-4 h-4 text-[#3c4c42]" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <FiTrash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="meal-plan-content">
                                <div className="space-y-4">
                                    {diasSemana.map((dia) => {
                                        const dayRecipes = plan.recetas?.find(r => r.dia_semana === dia);
                                        if (!dayRecipes) return null;

                                        return (
                                            <div key={dia} className="pb-4 border-b border-gray-100 last:border-0">
                                                <h4 className="font-arsenal text-[#3c4c42] mb-3">{dia}</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {dayRecipes.id_soup && (
                                                        <div className="bg-[#f4f4f4] p-3 rounded-lg">
                                                            <p className="text-xs text-[#5c6861] mb-1">Sopa</p>
                                                            <p className="font-medium text-[#3c4c42]">{recipes[dayRecipes.id_soup]}</p>
                                                        </div>
                                                    )}
                                                    {dayRecipes.id_main && (
                                                        <div className="bg-[#f4f4f4] p-3 rounded-lg">
                                                            <p className="text-xs text-[#5c6861] mb-1">Plato Fuerte</p>
                                                            <p className="font-medium text-[#3c4c42]">{recipes[dayRecipes.id_main]}</p>
                                                        </div>
                                                    )}
                                                    {dayRecipes.id_side && (
                                                        <div className="bg-[#f4f4f4] p-3 rounded-lg">
                                                            <p className="text-xs text-[#5c6861] mb-1">Guarnición</p>
                                                            <p className="font-medium text-[#3c4c42]">{recipes[dayRecipes.id_side]}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Planes;