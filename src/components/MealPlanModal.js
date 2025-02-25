import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiShoppingBag, FiList } from 'react-icons/fi';

const MealPlanModal = ({ mealPlan, onClose }) => {
    const [aggregatedIngredients, setAggregatedIngredients] = useState({});

    useEffect(() => {
        if (mealPlan && mealPlan.comidas) {
            const ingredients = {};
            mealPlan.comidas.forEach(meal => {
                if (meal.receta && meal.receta.ingredientes) {
                    meal.receta.ingredientes.forEach(ing => {
                        const key = `${ing.ingrediente}_${ing.unidad}`;
                        if (!ingredients[key]) {
                            ingredients[key] = {
                                ingrediente: ing.ingrediente,
                                unidad: ing.unidad,
                                cantidad_total: 0
                            };
                        }
                        ingredients[key].cantidad_total += parseFloat(ing.cantidad_total) || 0;
                    });
                }
            });
            setAggregatedIngredients(ingredients);
        }
    }, [mealPlan]);

    // Group meals by day
    const mealsByDay = mealPlan?.comidas?.reduce((acc, meal) => {
        if (!acc[meal.dia]) {
            acc[meal.dia] = [];
        }
        acc[meal.dia].push(meal);
        return acc;
    }, {});

    if (!mealPlan) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Header Section */}
                <div className="modal-header">
                    <button 
                        onClick={onClose}
                        className="close-button"
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                    
                    <h2 className="recipe-title">
                        {mealPlan.nombre}
                    </h2>
                    
                    <div className="recipe-meta">
                        <span className="meta-item">
                            <FiCalendar />
                            {mealPlan.duracion} days
                        </span>
                        <span className="meta-item">
                            <FiClock />
                            {mealPlan.comidas?.length || 0} meals
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="modal-body">
                    {/* Meal Plan Section */}
                    <div className="modal-section">
                        <h3 className="modal-section-title">
                            <FiList />
                            Meal Plan Schedule
                        </h3>
                        <div className="meal-plan-days">
                            {mealPlan.comidas?.map((meal, index) => (
                                <div key={index} className="meal-plan-modal-day">
                                    <div className="meal-plan-modal-day-title">
                                        {meal.dia} - {meal.tipo_comida}
                                    </div>
                                    <div className="meal-plan-modal-meal">
                                        <div className="meal-plan-modal-meal-name">
                                            {meal.receta?.nombre}
                                        </div>
                                        {meal.receta?.descripcion && (
                                            <p className="meal-plan-modal-meal-description">
                                                {meal.receta.descripcion}
                                            </p>
                                        )}
                                        <div className="meal-plan-modal-meal-portions">
                                            {meal.receta?.racion} portions
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shopping List Section */}
                    <div className="modal-section">
                        <h3 className="modal-section-title">
                            <FiShoppingBag />
                            Shopping List
                        </h3>
                        <div className="shopping-list-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Ingredient</th>
                                        <th className="text-right">Amount</th>
                                        <th>Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(aggregatedIngredients)
                                        .sort((a, b) => a.ingrediente.localeCompare(b.ingrediente))
                                        .map((ing, index) => (
                                            <tr key={index}>
                                                <td>{ing.ingrediente}</td>
                                                <td className="text-right">{ing.cantidad_total}</td>
                                                <td>{ing.unidad}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealPlanModal; 