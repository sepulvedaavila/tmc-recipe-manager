import React, { useState } from 'react';


function NuevaRecetaForm() {
    const [formData, setFormData] = useState({
        titulo: '',
        fuente: '',
        tipoPlatillo: '',
        racion: 1,
        ingredientes: [{ ingrediente: '', unidad: '', cantidad: 0 }],
        descripcion: '',
        tags: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('./api/recetas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert('Recipe saved successfully!');
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...formData.ingredientes];
        updatedIngredients[index][field] = value;
        setFormData({ ...formData, ingredientes: updatedIngredients });
    };

    const handleAddIngredient = () => {
        setFormData({
            ...formData,
            ingredientes: [...formData.ingredientes, { ingrediente: '', unidad: '', cantidad: 0 }],
        });
    };

    const handleRemoveIngredient = (index) => {
        const updatedIngredients = formData.ingredientes.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredientes: updatedIngredients });
    };

    return (
        <form onSubmit={handleSubmit} className="styled-form">
            <h2>Nueva Receta</h2>
            <label>Título:<input type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} /></label>
            <label>Fuente:<input type="text" value={formData.fuente} onChange={(e) => setFormData({ ...formData, fuente: e.target.value })} /></label>
            <label>Tipo de Platillo:
                <select value={formData.tipoPlatillo} onChange={(e) => setFormData({ ...formData, tipoPlatillo: e.target.value })}>
                    <option value="">Seleccione...</option>
                    <option value="Sopa">Sopa</option>
                    <option value="Plato Fuerte">Plato Fuerte</option>
                    <option value="Guarnición">Guarnición</option>
                </select>
            </label>
            <label>Ración:<input type="number" value={formData.racion} onChange={(e) => setFormData({ ...formData, racion: e.target.value })} /></label>

            <h3>Ingredientes</h3>
            {formData.ingredientes.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                    <label>Ingrediente:<input type="text" value={ingredient.ingrediente} onChange={(e) => handleIngredientChange(index, 'ingrediente', e.target.value)} /></label>
                    <label>Unidad:<input type="text" value={ingredient.unidad} onChange={(e) => handleIngredientChange(index, 'unidad', e.target.value)} /></label>
                    <label>Cantidad:<input type="number" value={ingredient.cantidad} onChange={(e) => handleIngredientChange(index, 'cantidad', e.target.value)} /></label>
                    <button type="button" className="remove-button" onClick={() => handleRemoveIngredient(index)}>Eliminar</button>
                </div>
            ))}
            <button type="button" className="add-button" onClick={handleAddIngredient}>Añadir Ingrediente</button>

            <label>Descripción:<textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}></textarea></label>
            <label>Tags:<input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} /></label>
            <button type="submit" className="submit-button">Guardar</button>
        </form>
    );
}

export default NuevaRecetaForm;