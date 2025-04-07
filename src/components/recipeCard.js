import React, { useState } from 'react';

const RecipeCard = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`recipe-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h3>{recipe.nombre || 'Sin nombre'}</h3>
                <p className="type">{recipe.tipo_platillo || 'Sin categoría'}</p>
            </div>

            {isExpanded && (
                <div className="card-body">
                    <p><strong>Fuente:</strong> {recipe.fuente || 'No especificada'}</p>
                    <p><strong>Raciones:</strong> {recipe.racion || 'No especificado'}</p>
                    <p><strong>Descripción:</strong> {recipe.descripcion || 'No hay descripción'}</p>
                    
                    {recipe.ingredientes && recipe.ingredientes.length > 0 ? (
                        <>
                            <h4>Ingredientes:</h4>
                            <ul>
                                {recipe.ingredientes.map((ing, idx) => (
                                    <li key={idx}>
                                        {ing.cantidad_total || '-'} {ing.unidad || ''} {ing.ingrediente || 'Ingrediente'} 
                                        {ing.por_persona ? ` (${ing.por_persona} por persona)` : ''}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No hay ingredientes registrados</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipeCard;
