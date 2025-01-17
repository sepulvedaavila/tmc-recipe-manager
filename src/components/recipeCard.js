import React, { useState } from 'react';

const RecipeCard = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`recipe-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h3>{recipe.nombre}</h3>
                <p className="type">{recipe.tipo_platillo}</p>
            </div>

            {isExpanded && (
                <div className="card-body">
                    <p><strong>Fuente:</strong> {recipe.fuente}</p>
                    <p><strong>Descripción:</strong> {recipe.descripcion}</p>
                    <h4>Ingredientes:</h4>
                    <ul>
                        {recipe.ingredientes.map((ing, idx) => (
                            <li key={idx}>
                                {ing.cantidad_total} {ing.unidad} {ing.ingrediente} ({ing.por_persona} per serving)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecipeCard;
