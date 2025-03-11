import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
});

function NuevaRecetaForm() {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        titulo: '',
        fuente: '',
        tipoPlatillo: '',
        racion: 1,
        ingredientes: [{ ingrediente: '', unidad: '', cantidad: 0 }],
        descripcion: '',
        tags: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [plainText, setPlainText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setIsProcessing(true);
            try {
                // Here you would implement the image processing logic
                // For example, using Tesseract.js for OCR
                // const text = await processImage(file);
                // const recipeData = parseRecipeText(text);
                // setFormData(recipeData);
                setIsProcessing(false);
            } catch (error) {
                console.error('Error processing image:', error);
                setIsProcessing(false);
                alert('Error al procesar la imagen');
            }
        }
    };

    const handlePlainTextInput = async (text) => {
        setPlainText(text);
        try {
            // Here you would implement the text processing logic
            // const recipeData = parseRecipeText(text);
            // setFormData(recipeData);
        } catch (error) {
            console.error('Error processing text:', error);
            alert('Error al procesar el texto');
        }
    };

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
        <ThemeProvider theme={theme}>
            <div className="recipe-form-container">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="input-method-tabs"
                >
                    <Tab label="Subir Imagen" />
                    <Tab label="Texto Plano" />
                    <Tab label="Formulario Manual" />
                </Tabs>

                {activeTab === 0 && (
                    <div className="image-upload-section">
                        <h2 className="form-section-title">Subir Imagen de Receta</h2>
                        <div className="upload-container">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input"
                                id="recipe-image-input"
                            />
                            {!imageFile && (
                                <>
                                    <div className="upload-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </div>
                                    <label htmlFor="recipe-image-input" className="upload-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                        Seleccionar imagen
                                    </label>
                                    <p className="upload-hint">
                                        Arrastra y suelta una imagen aquí o haz clic en el botón para seleccionar
                                    </p>
                                </>
                            )}
                            {isProcessing && (
                                <div className="processing-indicator">
                                    Procesando imagen...
                                </div>
                            )}
                            {imageFile && !isProcessing && (
                                <>
                                    <div className="image-preview">
                                        <img src={URL.createObjectURL(imageFile)} alt="Vista previa de la receta" />
                                    </div>
                                    <label htmlFor="recipe-image-input" className="upload-button">
                                        Cambiar imagen
                                    </label>
                                </>
                            )}
                        </div>
                        <div className="form-buttons">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => {
                                    setImageFile(null);
                                    setActiveTab(2);
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn-submit"
                                disabled={!imageFile || isProcessing}
                                onClick={handleSubmit}
                            >
                                {isProcessing ? 'Procesando...' : 'Procesar y Guardar'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 1 && (
                    <div className="text-input-section">
                        <h2 className="form-section-title">Ingresar Texto de Receta</h2>
                        <div className="text-input-container">
                            <textarea
                                className="recipe-text-input"
                                value={plainText}
                                onChange={(e) => handlePlainTextInput(e.target.value)}
                                placeholder="Pegue aquí el texto de su receta...

Formato sugerido:
Título de la Receta

Porciones: 4

Ingredientes:
- 200g ingrediente 1
- 2 tazas ingrediente 2
- 3 cucharadas ingrediente 3

Instrucciones:
1. Primer paso...
2. Segundo paso...
3. Tercer paso..."
                            />
                        </div>
                        <div className="form-buttons">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => {
                                    setPlainText('');
                                    setActiveTab(2);
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn-submit"
                                disabled={!plainText}
                                onClick={handleSubmit}
                            >
                                Procesar y Guardar
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 2 && (
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
                )}
            </div>
        </ThemeProvider>
    );
}

export default NuevaRecetaForm;