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
        const response = await fetch('./api/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert('Recipe saved successfully!');
            setFormData({
                titulo: '',
                fuente: '',
                refFuente: '',
                tipoPlatillo: '',
                racion: 1,
                ingredientes: [{ ingrediente: '', unidad: '', cantidad: 0 }],
                descripcion: '',
                tags: '',
            });
        } else {
            alert("Error al guardar la receta");
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
        <div className="recipe-form-container">
            <form onSubmit={handleSubmit} className="recipe-form">
                {/* Basic Information Section */}
                <div className="form-section">
                    <h2 className="form-section-title">Nueva Receta</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required-field">Título</label>
                            <input 
                                type="text" 
                                className="form-input"
                                value={formData.titulo} 
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Fuente</label>
                            <input 
                                type="text" 
                                className="form-input"
                                value={formData.fuente} 
                                onChange={(e) => setFormData({ ...formData, fuente: e.target.value })} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reference Link</label>
                            <input 
                                type="url" 
                                className="form-input"
                                value={formData.refFuente} 
                                onChange={(e) => setFormData({ ...formData, refFuente: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required-field">Tipo de Platillo</label>
                            <select 
                                className="form-select"
                                value={formData.tipoPlatillo} 
                                onChange={(e) => setFormData({ ...formData, tipoPlatillo: e.target.value })}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="Sopa">Sopa</option>
                                <option value="Plato Fuerte">Plato Fuerte</option>
                                <option value="Guarnición">Guarnición</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label required-field">Ración</label>
                            <input 
                                type="number" 
                                className="form-input"
                                value={formData.racion} 
                                onChange={(e) => setFormData({ ...formData, racion: e.target.value })}
                                required
                                min="1" 
                            />
                        </div>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="form-section">
                    <h3 className="form-section-title">Ingredientes</h3>
                    <div className="ingredients-list">
                        {formData.ingredientes.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <input 
                                    type="text" 
                                    placeholder="Ingrediente"
                                    value={ingredient.ingrediente} 
                                    onChange={(e) => handleIngredientChange(index, 'ingrediente', e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Unidad"
                                    value={ingredient.unidad} 
                                    onChange={(e) => handleIngredientChange(index, 'unidad', e.target.value)} 
                                />
                                <input 
                                    type="number" 
                                    placeholder="Cantidad"
                                    value={ingredient.cantidad} 
                                    onChange={(e) => handleIngredientChange(index, 'cantidad', e.target.value)} 
                                />
                                <button 
                                    type="button" 
                                    className="btn-remove" 
                                    onClick={() => handleRemoveIngredient(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn-add" onClick={handleAddIngredient}>
                        + Añadir Ingrediente
                    </button>
                </div>

                {/* Description Section */}
                <div className="form-section">
                    <h3 className="form-section-title">Detalles</h3>
                    <div className="form-group">
                        <label className="form-label required-field">Descripción</label>
                        <textarea 
                            className="form-textarea"
                            value={formData.descripcion} 
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tags</label>
                        <input 
                            type="text" 
                            className="form-input"
                            value={formData.tags} 
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Separar tags con comas" 
                        />
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="button" className="btn-cancel">Cancelar</button>
                    <button type="submit" className="btn-submit">Guardar Receta</button>
                </div>
            </form>
        </div>
    );
}

export default NuevaRecetaForm;