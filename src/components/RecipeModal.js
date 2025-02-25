import React, { useState } from 'react';
import { FiX, FiUser, FiTag, FiClock, FiBookOpen, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const RecipeModal = ({ recipe, onClose }) => {
    const [isIngredientsOpen, setIsIngredientsOpen] = useState(true);
    
    if (!recipe) return null;

    // Close modal when clicking outside
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
                        aria-label="Cerrar"
                    >
                        <FiX />
                    </button>
                    
                    <h2 className="recipe-title">
                        {recipe.nombre}
                    </h2>
                    
                    <div className="recipe-meta">
                        <span className="meta-item">
                            <FiUser />
                            {recipe.racion} porciones
                        </span>
                        <span className="meta-item">
                            <FiTag />
                            {recipe.tipo_platillo}
                        </span>
                        {recipe.fuente && (
                            <span className="meta-item">
                                <FiBookOpen />
                                {recipe.fuente}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="modal-body">
                    {/* Description Section */}
                    <section className="modal-section">
                        <h3 className="modal-section-title">
                            Descripción
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {recipe.descripcion}
                        </p>
                    </section>

                    {/* Ingredients Section */}
                    <section className="modal-section">
                        <div 
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                        >
                            <h3 className="modal-section-title flex items-center justify-between w-full">
                                Ingredientes
                                <span className="text-sm text-gray-500 ml-2">
                                    ({recipe.ingredientes?.length || 0} items)
                                </span>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto">
                                    {isIngredientsOpen ? (
                                        <FiChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </h3>
                        </div>
                        
                        {isIngredientsOpen && (
                            <div className="bg-gray-50 rounded-xl p-4 md:p-6 shadow-inner overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-sm uppercase tracking-wider text-gray-500">
                                            <th className="text-left py-3 pl-4 border-b-2 border-gray-200">
                                                Ingrediente
                                            </th>
                                            <th className="text-right py-3 border-b-2 border-gray-200">
                                                Por Persona
                                            </th>
                                            <th className="text-right py-3 border-b-2 border-gray-200">
                                                Total
                                            </th>
                                            <th className="text-right py-3 pr-4 border-b-2 border-gray-200">
                                                Unidad
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recipe.ingredientes?.map((ing, index) => (
                                            <tr 
                                                key={index} 
                                                className={`
                                                    hover:bg-white hover:bg-opacity-70 transition-colors
                                                    ${index % 2 === 0 ? 'bg-white bg-opacity-50' : ''}
                                                `}
                                            >
                                                <td className="py-3 pl-4 font-medium text-gray-700 border-b border-gray-100">
                                                    {ing.ingrediente}
                                                </td>
                                                <td className="py-3 text-right text-gray-600 border-b border-gray-100">
                                                    {ing.por_persona}
                                                </td>
                                                <td className="py-3 text-right text-gray-600 border-b border-gray-100">
                                                    {ing.cantidad_total}
                                                </td>
                                                <td className="py-3 pr-4 text-right text-gray-500 border-b border-gray-100">
                                                    {ing.unidad}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Notes Section */}
                    {recipe.notas && (
                        <section className="modal-section">
                            <h3 className="modal-section-title">
                                Notas
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {recipe.notas}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeModal; 