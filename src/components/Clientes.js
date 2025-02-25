import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card-components';
import { FiMail, FiUser, FiEdit2, FiTrash2, FiPlus, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Clientes = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/clients');
            const data = await response.json();
            setClients(data.clients);
            setError(null);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Error al cargar los clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            return;
        }

        try {
            const response = await fetch(`/api/clients/${clientId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the client from the state
                setClients(clients.filter(client => client.id !== clientId));
            } else {
                throw new Error('Error deleting client');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el cliente');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3c4c42]"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 p-4 text-center">{error}</div>
    );

    return (
        <div className="main-content">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-arsenal text-[#3c4c42]">Clientes</h1>
                    <Link
                        to="/new-client"
                        className="flex items-center gap-2 bg-[#3c4c42] text-white px-4 py-2 rounded-lg hover:bg-[#5c6861] transition-colors"
                    >
                        <FiPlus /> Nuevo Cliente
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <Card 
                            key={client.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardHeader className="p-6 border-b border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-arsenal text-[#3c4c42]">
                                            {client.fullName}
                                        </CardTitle>
                                        <div className="flex flex-col gap-2 mt-2">
                                            <span className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiUser className="w-4 h-4" />
                                                {client.username}
                                            </span>
                                            <span className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiMail className="w-4 h-4" />
                                                {client.email}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link 
                                            to={`/edit-client/${client.id}`}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4 text-[#3c4c42]" />
                                        </Link>
                                        <button 
                                            className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                            onClick={() => handleDeleteClient(client.id)}
                                        >
                                            <FiTrash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-2 text-gray-600">
                                    <FiFileText className="w-4 h-4 mt-1" />
                                    <p className="text-sm">
                                        {client.dietaryPreferences || 'Sin preferencias dietéticas especificadas'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Clientes; 