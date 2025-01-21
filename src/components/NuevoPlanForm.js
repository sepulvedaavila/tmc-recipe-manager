import React, { useState, useEffect } from 'react';

function NuevoPlanForm() {
    const [planData, setPlanData] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        recetas: [{ recetaId: '', nombre: '' }],
        dias: [],
        racion: 1,
        comidas: {},
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
                        id: recipe.id, nombre: recipe.nombre, descripcion: recipe.descripcion,
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

    const handleComidaChange = (day, tipo, value) => {
        setPlanData((prev) => {
            const updatedComidas = { ...prev.comidas };
            if (!updatedComidas[day]) {
                updatedComidas[day] = {};
            }
            updatedComidas[day][tipo] = value;
            return { ...prev, comidas: updatedComidas };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('./api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        if (response.ok) {
            alert('Plan saved successfully!');
            setPlanData({
                nombre: '',
                descripcion: '',
                fechaInicio: '',
                fechaFin: '',
                recetas: [{ recetaId: '', nombre: '' }],
                dias: [],
                racion: 1,
                comidas: {},
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
                    value={planData.descripcion}
                    onChange={(e) => setPlanData({ ...planData, descripcion: e.target.value })}
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
                    <label>Sopa:
                        {planData.recetas.map((receta, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    list={`soup-receta-suggestions-${index}`}
                                    value={receta.nombre}
                                    onChange={(e) => handleComidaChange(day, 'Sopa', e.target.value)}
                                />
                                <datalist id={`soup-receta-suggestions-${index}`}>
                                    {recipes.filter(object => object.tipo === 'Sopa').map((object) => (
                                        <option key={object.id} value={object.nombre} />
                                    ))}
                                </datalist>
                            </div>
                        ))}
                        <input type="text" onChange={(e) => handleComidaChange(day, 'Sopa', e.target.value)} /></label>
                    <label>Plato Fuerte:
                        {planData.recetas.map((receta, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    list={`main-receta-suggestions-${index}`}
                                    value={receta.nombre}
                                    onChange={(e) => handleComidaChange(day, 'Plato Fuerte', e.target.value)}
                                />
                                <datalist id={`main-receta-suggestions-${index}`}>
                                    {recipes.filter(object => object.tipo === 'Plato Fuerte').map((object) => (
                                        <option key={object.id} value={object.nombre} />
                                    ))}
                                </datalist>
                            </div>
                        ))}
                        <input type="text" onChange={(e) => handleComidaChange(day, 'Plato Fuerte', e.target.value)} />
                    </label>
                    <label>Guarnición:
                        {planData.recetas.map((receta, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    list={`side-receta-suggestions-${index}`}
                                    value={receta.nombre}
                                    onChange={(e) => handleComidaChange(day, 'Guarnición', e.target.value)}
                                />
                                <datalist id={`side-receta-suggestions-${index}`}>
                                    {recipes.filter(object => object.tipo === 'Guarnicion').map((object) => (
                                        <option key={object.id} value={object.nombre} />
                                    ))}
                                </datalist>
                            </div>
                        ))}
                        <input type="text" onChange={(e) => handleComidaChange(day, 'Guarnición', e.target.value)} />
                    </label>
                </div>
            ))}

            <button type="submit" className="submit-button">Guardar Plan</button>
        </form>
    );
}

export default NuevoPlanForm;