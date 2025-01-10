import React, { useState } from 'react';

function NuevoPlanForm() {
    const [planData, setPlanData] = useState({
        dias: [],
        racion: 1,
        comidas: {},
    });

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
        const response = await fetch('/api/planes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        if (response.ok) {
            alert('Plan saved successfully!');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="styled-form">
            <h2>Nuevo Plan</h2>
            <label>Ración:<input type="number" value={planData.racion} onChange={(e) => setPlanData({ ...planData, racion: e.target.value })} /></label>

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
                    <label>Sopa:<input type="text" onChange={(e) => handleComidaChange(day, 'Sopa', e.target.value)} /></label>
                    <label>Plato Fuerte:<input type="text" onChange={(e) => handleComidaChange(day, 'Plato Fuerte', e.target.value)} /></label>
                    <label>Guarnición:<input type="text" onChange={(e) => handleComidaChange(day, 'Guarnición', e.target.value)} /></label>
                </div>
            ))}

            <button type="submit" className="submit-button">Guardar Plan</button>
        </form>
    );
}

export default NuevoPlanForm;