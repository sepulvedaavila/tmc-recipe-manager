import React, { useState, useEffect } from 'react';

function NuevoPlanForm() {
    const [planData, setPlanData] = useState({
        nombre: '',
        cliente: '',
        dias: [],
        racion: 1,
        comidas: {},
        recetas: []
    });
    const [recipes, setRecipes] = useState([]);

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('./api/recipes');
                if (!response.ok) throw new Error('Failed to fetch recipes');
                const data = await response.json();

                // The response is now directly an array of formatted recipes
                const recipesArray = data.map((recipe) => {
                    return {
                        id: recipe.recipe_id,
                        nombre: recipe.nombre,
                        descripcion: recipe.descripcion,
                        racion: recipe.racion,
                        tipo: recipe.tipo_platillo
                    };
                });
                setRecipes(recipesArray);
                //console.log('Fetched recipes:', recipesArray); // Debug log

            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);


    const handleDayChange = (day) => {
        setPlanData((prev) => {
            const updatedDias = prev.dias.includes(day)
                ? prev.dias.filter((d) => d !== day)
                : [...prev.dias, day];
            return { ...prev, dias: updatedDias };
        });
    };

    const handleComidaChange = (day, id, tipo, value) => {
        setPlanData((prev) => {
            // Update comidas for display purposes
            const updatedComidas = { ...prev.comidas };
            if (!updatedComidas[day]) {
                updatedComidas[day] = {};
            }
            updatedComidas[day][tipo] = value;

            // Update recetas grouped by day
            const updatedRecetas = prev.recetas.filter(r => r.dia_semana !== day);
            
            // Find existing recipe group for this day
            const existingDayRecipes = prev.recetas.find(r => r.dia_semana === day) || {
                dia_semana: day,
                id_soup: null,
                id_main: null,
                id_side: null
            };

            // Update the appropriate recipe ID based on tipo
            const updatedDayRecipes = {
                ...existingDayRecipes,
                ...(tipo === 'Sopa' && { id_soup: id }),
                ...(tipo === 'Plato Fuerte' && { id_main: id }),
                ...(tipo === 'Guarnición' && { id_side: id })
            };

            return {
                ...prev,
                comidas: updatedComidas,
                recetas: [...updatedRecetas, updatedDayRecipes]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format the data for the backend
        const formattedData = {
            nombre: planData.nombre,
            cliente: planData.cliente,
            racion: planData.racion,
            recetas: planData.recetas.map(receta => ({
                dia_semana: receta.dia_semana,
                id_soup: receta.id_soup,
                id_main: receta.id_main,
                id_side: receta.id_side
            }))
        };

        console.log('Sending plan data:', formattedData);

        try {
            const response = await fetch('./api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                alert('Plan guardado exitosamente!');
                setPlanData({
                    nombre: '',
                    cliente: '',
                    dias: [],
                    racion: 1,
                    comidas: {},
                    recetas: []
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar el plan');
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="styled-form">
            <h2>Nuevo Plan</h2>
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    value={planData.nombre}
                    onChange={(e) => setPlanData({ ...planData, nombre: e.target.value })}
                />
            </div>
            <div>
                <label>Cliente:</label>
                <input
                    type="text"
                    value={planData.cliente}
                    onChange={(e) => setPlanData({ ...planData, cliente: e.target.value })}
                />
            </div>
            <div>
                <label>Ración:<input type="number" value={planData.racion} onChange={(e) => setPlanData({ ...planData, racion: e.target.value })} /></label>
            </div>


            <h3>Días de la Semana</h3>
            <div className="days-checkbox-group">
                {diasSemana.map((day) => (
                    <label key={day} className="day-checkbox">
                        <input
                            type="checkbox"
                            checked={planData.dias.includes(day)}
                            onChange={() => handleDayChange(day)}
                        />
                        {day}
                    </label>
                ))}
            </div>

            <h3>Comidas</h3>
            {planData.dias.map((day) => (
                <div key={day} className="meal-day">
                    <h4>{day}</h4>
                    <div>
                        <label>Sopa:</label>
                        <select
                            value={planData.comidas[day]?.['Sopa'] || ''}
                            onChange={(e) => handleComidaChange(day, e.target.selectedOptions[0].getAttribute('meal_id'), 'Sopa', e.target.value)}
                        >
                            <option value="">Seleccionar sopa</option>
                            {recipes
                                .filter(recipe => recipe.tipo === 'Sopa')
                                .map((recipe) => (
                                    <option 
                                        key={recipe.id} 
                                        meal_id={recipe.id} 
                                        value={recipe.nombre}
                                    >
                                        {recipe.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <label>Plato Fuerte:</label>
                        <select
                            value={planData.comidas[day]?.['Plato Fuerte'] || ''}
                            onChange={(e) => handleComidaChange(day, e.target.selectedOptions[0].getAttribute('meal_id'), 'Plato Fuerte', e.target.value)}
                        >
                            <option value="">Seleccionar plato fuerte</option>
                            {recipes
                                .filter(recipe => recipe.tipo === 'Plato Fuerte')
                                .map((recipe) => (
                                    <option 
                                        key={recipe.id} 
                                        meal_id={recipe.id} 
                                        value={recipe.nombre}
                                    >
                                        {recipe.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <label>Guarnición:</label>
                        <select
                            value={planData.comidas[day]?.['Guarnición'] || ''}
                            onChange={(e) => handleComidaChange(day, e.target.selectedOptions[0].getAttribute('meal_id'), 'Guarnición', e.target.value)}
                        >
                            <option value="">Seleccionar guarnición</option>
                            {recipes
                                .filter(recipe => recipe.tipo === 'Guarnicion')
                                .map((recipe) => (
                                    <option 
                                        key={recipe.id} 
                                        meal_id={recipe.id} 
                                        value={recipe.nombre}
                                    >
                                        {recipe.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            ))}

            <button type="submit" className="submit-button">Guardar Plan</button>
        </form>
    );
}

export default NuevoPlanForm;