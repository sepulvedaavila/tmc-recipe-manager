import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiShoppingBag } from 'react-icons/fi';

const MealPlanModal = ({ mealPlan, onClose }) => {
    const [aggregatedIngredients, setAggregatedIngredients] = useState({});
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'shopping'

    useEffect(() => {
        if (mealPlan && mealPlan.comidas) {
            // Aggregate ingredients across all recipes in the meal plan
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

                    {/* Tab Navigation */}
                    <div className="flex mt-6 border-b border-gray-200">
                        <button
                            className={`px-4 py-2 font-medium text-sm ${
                                activeTab === 'plan'
                                    ? 'text-[#28a745] border-b-2 border-[#28a745]'
                                    : 'text-gray-500 hover:text-[#28a745]'
                            }`}
                            onClick={() => setActiveTab('plan')}
                        >
                            Meal Plan
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm ${
                                activeTab === 'shopping'
                                    ? 'text-[#28a745] border-b-2 border-[#28a745]'
                                    : 'text-gray-500 hover:text-[#28a745]'
                            }`}
                            onClick={() => setActiveTab('shopping')}
                        >
                            Shopping List
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="modal-body">
                    {activeTab === 'plan' ? (
                        // Meal Plan View
                        <div className="space-y-6">
                            {mealPlan.comidas?.map((meal, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {meal.dia} - {meal.tipo_comida}
                                            </h3>
                                            <p className="text-lg font-semibold text-[#28a745]">
                                                {meal.receta?.nombre}
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {meal.receta?.racion} portions
                                        </span>
                                    </div>
                                    {meal.receta?.descripcion && (
                                        <p className="text-gray-600 text-sm mt-2">
                                            {meal.receta.descripcion}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Shopping List View
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <FiShoppingBag className="text-[#28a745] w-5 h-5" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Shopping List
                                </h3>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ingredient
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.values(aggregatedIngredients)
                                            .sort((a, b) => a.ingrediente.localeCompare(b.ingrediente))
                                            .map((ing, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {ing.ingrediente}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                        {ing.cantidad_total}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {ing.unidad}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MealPlanModal; 