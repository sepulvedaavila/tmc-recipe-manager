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
                const dataRecipes = await response.json();

                const recipesArray = dataRecipes.recipeResult.map((recipe) => {
                    return {
                        id: recipe.id_receta, nombre: recipe.nombre, descripcion: recipe.descripcion,
                        racion: recipe.racion, tags: recipe.tags, tipo: recipe.tipo_platillo
                    };
                });
                setRecipes(recipesArray);

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
            const updatedComidas = { ...prev.comidas };
            if (!updatedComidas[day]) {
                updatedComidas[day] = {};
            }
            updatedComidas[day][tipo] = value;
            console.log(updatedComidas);

            const updatedComidas2 = { ...prev.recetas };
            if (!updatedComidas2[day]) {
                updatedComidas2[day] = {};
            }
            updatedComidas2[day][tipo] = id;
            console.log(updatedComidas2);
            return { ...prev, comidas: updatedComidas, recetas: updatedComidas2 };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(planData);
        const response = await fetch('./api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        if (response.ok) {
            alert('Plan saved successfully!');
            setPlanData({
                nombre: '',
                cliente: '',
                dias: [],
                racion: 1,
                comidas: {},
                recetas: []
            });
        } else {
            alert('Error saving plan');
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
                            <option value="">Select a soup</option>
                            {recipes.filter(object => object.tipo === 'Sopa').map((object) => (
                                <option key={object.id} meal_id={object.id} value={object.nombre}>
                                    {object.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Plato Fuerte:</label>
                        <select
                            value={planData.comidas[day]?.['Plato Fuerte'] || ''}
                            onChange={(e) => handleComidaChange(day, e.target.selectedOptions[0].getAttribute('meal_id'), 'Plato Fuerte', e.target.value)}
                        >
                            <option value="">Select a main course</option>
                            {recipes.filter(object => object.tipo === 'Plato Fuerte').map((object) => (
                                <option key={object.id} meal_id={object.id} value={object.nombre}>
                                    {object.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Guarnición:</label>
                        <select
                            value={planData.comidas[day]?.['Side'] || ''}
                            onChange={(e) => handleComidaChange(day, e.target.selectedOptions[0].getAttribute('meal_id'), 'Guarnición', e.target.value)}
                        >
                            <option value="">Select a side dish</option>
                            {recipes.filter(object => object.tipo === 'Guarnicion').map((object) => (
                                <option key={object.id} meal_id={object.id} value={object.nombre}>
                                    {object.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <button type="submit" className="submit-button">Guardar Plan</button>
        </form>
    );
}

export default NuevoPlanForm;