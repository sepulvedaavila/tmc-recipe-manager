import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const MealPlanModal = ({ mealPlan, onClose }) => {
    const [aggregatedIngredients, setAggregatedIngredients] = useState({});
    const [isMealScheduleOpen, setIsMealScheduleOpen] = useState(true);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(true);

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
                    {/* Meal Schedule Section */}
                    <section className="modal-section">
                        <div 
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setIsMealScheduleOpen(!isMealScheduleOpen)}
                        >
                            <h3 className="modal-section-title flex items-center justify-between w-full">
                                Meal Schedule
                                <span className="text-sm text-gray-500 ml-2">
                                    ({Object.keys(mealsByDay).length} days)
                                </span>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto">
                                    {isMealScheduleOpen ? (
                                        <FiChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </h3>
                        </div>

                        {isMealScheduleOpen && (
                            <div className="space-y-6">
                                {Object.entries(mealsByDay).map(([day, meals]) => (
                                    <div key={day} className="bg-gray-50 rounded-xl overflow-hidden">
                                        <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {day}
                                            </h4>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {meals.map((meal, index) => (
                                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2">
                                                            <span className="inline-block px-3 py-1 bg-[#28a745] bg-opacity-10 rounded-full text-sm font-medium text-[#28a745]">
                                                                {meal.tipo_comida}
                                                            </span>
                                                            <p className="text-lg font-bold text-gray-900">
                                                                {meal.receta?.nombre}
                                                            </p>
                                                            {meal.receta?.descripcion && (
                                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                                    {meal.receta.descripcion}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                                            {meal.receta?.racion} portions
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Shopping List Section */}
                    <section className="modal-section mt-8">
                        <div 
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setIsShoppingListOpen(!isShoppingListOpen)}
                        >
                            <h3 className="modal-section-title flex items-center justify-between w-full">
                                Shopping List
                                <span className="text-sm text-gray-500 ml-2">
                                    ({Object.keys(aggregatedIngredients).length} items)
                                </span>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto">
                                    {isShoppingListOpen ? (
                                        <FiChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </h3>
                        </div>
                        
                        {isShoppingListOpen && (
                            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse bg-white">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="bg-[#f8f9fa] px-6 py-4 text-left text-base font-black text-gray-900 uppercase tracking-wider border-2 border-gray-200">
                                                    Ingredient
                                                </th>
                                                <th scope="col" className="bg-[#f8f9fa] px-6 py-4 text-center text-base font-black text-gray-900 uppercase tracking-wider border-2 border-gray-200 w-32">
                                                    Amount
                                                </th>
                                                <th scope="col" className="bg-[#f8f9fa] px-6 py-4 text-left text-base font-black text-gray-900 uppercase tracking-wider border-2 border-gray-200 w-32">
                                                    Unit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(aggregatedIngredients)
                                                .sort((a, b) => a.ingrediente.localeCompare(b.ingrediente))
                                                .map((ing, index) => (
                                                    <tr 
                                                        key={index} 
                                                        className={`
                                                            ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}
                                                            hover:bg-gray-100 transition-all duration-150
                                                        `}
                                                    >
                                                        <td className="px-6 py-3 text-sm font-medium text-gray-900 border border-gray-200 border-l-2">
                                                            {ing.ingrediente}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm font-bold text-gray-800 text-center border border-gray-200">
                                                            {ing.cantidad_total}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-gray-600 border border-gray-200 border-r-2">
                                                            {ing.unidad}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MealPlanModal; 