import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ClientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        dietaryPreferences: ''
    });

    useEffect(() => {
        if (id) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        try {
            const response = await fetch(`/api/clients/${id}`);
            const data = await response.json();
            setFormData(data);
        } catch (error) {
            console.error('Error fetching client:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(id ? `/api/clients/${id}` : '/api/clients', {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/clients');
            } else {
                throw new Error('Error saving client');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="main-content">
            <form onSubmit={handleSubmit} className="styled-form">
                <h2>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                
                <div className="mb-4">
                    <label htmlFor="fullName">Nombre Completo</label>
                    <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="dietaryPreferences">Preferencias Dietéticas</label>
                    <textarea
                        id="dietaryPreferences"
                        value={formData.dietaryPreferences}
                        onChange={(e) => setFormData({...formData, dietaryPreferences: e.target.value})}
                        rows="4"
                    />
                </div>

                <button type="submit" className="submit-button">
                    {id ? 'Actualizar' : 'Crear'} Cliente
                </button>
            </form>
        </div>
    );
};

export default ClientForm; 