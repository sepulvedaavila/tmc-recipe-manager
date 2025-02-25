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
                const recipesArray = data.map((recipe) => ({
                    id: recipe.recipe_id,
                    nombre: recipe.nombre,
                    descripcion: recipe.descripcion,
                    racion: recipe.racion,
                    tipo: recipe.tipo_platillo
                }));
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

            const updatedRecetas = prev.recetas.filter(r => r.dia_semana !== day);
            const existingDayRecipes = prev.recetas.find(r => r.dia_semana === day) || {
                dia_semana: day,
                id_soup: null,
                id_main: null,
                id_side: null
            };

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
        
        const formattedData = {
            nombre_plan: planData.nombre,
            cliente: 1,
            racion: parseInt(planData.racion),
            recetas: planData.recetas
                .filter(receta => receta.dia_semana && (receta.id_soup || receta.id_main || receta.id_side))
                .map(receta => ({
                    dia_semana: receta.dia_semana,
                    id_soup: receta.id_soup ? parseInt(receta.id_soup) : null,
                    id_main: receta.id_main ? parseInt(receta.id_main) : null,
                    id_side: receta.id_side ? parseInt(receta.id_side) : null
                }))
        };

        try {
            const response = await fetch('/api/plans', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
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
        <div className="recipe-form-container">
            <form onSubmit={handleSubmit} className="recipe-form">
                {/* Basic Information Section */}
                <div className="form-section">
                    <h2 className="form-section-title">Nuevo Plan de Comidas</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required-field">Nombre del Plan</label>
                            <input
                                type="text"
                                className="form-input"
                                value={planData.nombre}
                                onChange={(e) => setPlanData({ ...planData, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label required-field">Cliente</label>
                            <input
                                type="text"
                                className="form-input"
                                value={planData.cliente}
                                onChange={(e) => setPlanData({ ...planData, cliente: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required-field">Ración</label>
                            <input 
                                type="number" 
                                className="form-input"
                                value={planData.racion} 
                                onChange={(e) => setPlanData({ ...planData, racion: e.target.value })}
                                required
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                {/* Days Selection Section */}
                <div className="form-section">
                    <h3 className="form-section-title">Días de la Semana</h3>
                    <div className="days-checkbox-group">
                        {diasSemana.map((day) => (
                            <label key={day} className="day-checkbox">
                                <input
                                    type="checkbox"
                                    checked={planData.dias.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                />
                                <span>{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Meals Selection Section */}
                <div className="form-section">
                    <h3 className="form-section-title">Comidas por Día</h3>
                    <div className="meal-days-container">
                        {planData.dias.map((day) => (
                            <div key={day} className="meal-day">
                                <h4 className="meal-day-title">{day}</h4>
                                <div className="meal-selections">
                                    <div className="form-group">
                                        <label className="form-label">Sopa</label>
                                        <select
                                            className="form-select"
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
                                    <div className="form-group">
                                        <label className="form-label">Plato Fuerte</label>
                                        <select
                                            className="form-select"
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
                                    <div className="form-group">
                                        <label className="form-label">Guarnición</label>
                                        <select
                                            className="form-select"
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
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="button" className="btn-cancel">Cancelar</button>
                    <button type="submit" className="btn-submit">Guardar Plan</button>
                </div>
            </form>
        </div>
    );
}

export default NuevoPlanForm;