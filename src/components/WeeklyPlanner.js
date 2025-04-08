import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card-components';
import axios from 'axios';

const WeeklyPlanner = () => {
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

  useEffect(() => {
    fetchWeeklyPlan();
  }, []);

  const fetchWeeklyPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/meal-plans/weekly');
      setWeeklyPlan(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weekly plan:', error);
      setError('Error al cargar el plan semanal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (day, mealType) => {
    try {
      const response = await axios.post('/api/meal-plans/meals', {
        day,
        mealType,
        // Add other necessary meal data
      });
      
      // Update the weekly plan with the new meal
      setWeeklyPlan(prevPlan => ({
        ...prevPlan,
        [day]: {
          ...prevPlan[day],
          meals: [...(prevPlan[day]?.meals || []), response.data]
        }
      }));
    } catch (error) {
      console.error('Error adding meal:', error);
      setError('Error al agregar la comida');
    }
  };

  const handleDeleteMeal = async (mealId, day) => {
    try {
      await axios.delete(`/api/meal-plans/meals/${mealId}`);
      
      // Remove the meal from the weekly plan
      setWeeklyPlan(prevPlan => ({
        ...prevPlan,
        [day]: {
          ...prevPlan[day],
          meals: prevPlan[day].meals.filter(meal => meal.id !== mealId)
        }
      }));
    } catch (error) {
      console.error('Error deleting meal:', error);
      setError('Error al eliminar la comida');
    }
  };

  const handleEditMeal = async (mealId) => {
    try {
      // Find the meal in the current plan
      let mealToEdit = null;
      
      // Search through all days to find the meal
      Object.entries(weeklyPlan).forEach(([day, dayData]) => {
        const found = dayData.meals?.find(meal => meal.id === mealId);
        if (found) {
          mealToEdit = found;
        }
      });

      if (!mealToEdit) {
        throw new Error('Meal not found');
      }

      // For now, we'll just console.log - you can implement your edit UI here
      console.log('Editing meal:', mealToEdit);
      setEditingMeal(mealToEdit);
      
      // You might want to open a modal or form here to edit the meal
      // For example:
      // setShowEditModal(true);
      
    } catch (error) {
      console.error('Error preparing meal edit:', error);
      setError('Error al preparar la edición de la comida');
    }
  };

  /*const handleSaveEdit = async (mealId, updatedData) => {
    try {
      const response = await axios.put(`/api/meal-plans/meals/${mealId}`, updatedData);
      
      // Update the meal in the weekly plan
      setWeeklyPlan(prevPlan => {
        const newPlan = { ...prevPlan };
        Object.keys(newPlan).forEach(day => {
          if (newPlan[day].meals) {
            newPlan[day].meals = newPlan[day].meals.map(meal => 
              meal.id === mealId ? response.data : meal
            );
          }
        });
        return newPlan;
      });

      setEditingMeal(null); // Clear editing state
    } catch (error) {
      console.error('Error updating meal:', error);
      setError('Error al actualizar la comida');
    }
  };*/

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const mealTypes = ['Desayuno', 'Almuerzo', 'Cena'];

  if (loading) return <div>Cargando plan semanal...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-arsenal text-[#3c4c42]">Tu Plan Semanal</CardTitle>
            <button className="flex items-center text-[#3c4c42] font-arsenal">
              <Bell className="mr-2" />
              Recordarme
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => (
              <div key={day} className="text-center">
                <div className="font-arsenal font-semibold text-[#3c4c42] mb-2">{day}</div>
                <Card className="p-2">
                  {mealTypes.map((mealType) => (
                    <div key={mealType} className="mb-2">
                      <h4 className="text-sm font-semibold mb-1">{mealType}</h4>
                      {weeklyPlan[day]?.meals?.filter(meal => meal.type === mealType).map(meal => (
                        <div key={meal.id} className="flex items-center justify-between p-2 bg-[#f4f4f4] rounded">
                          <span>{meal.name}</span>
                          <div className="flex gap-2">
                            <Edit className="w-4 h-4 cursor-pointer" onClick={() => handleEditMeal(meal.id)} />
                            <Trash className="w-4 h-4 cursor-pointer text-red-500" onClick={() => handleDeleteMeal(meal.id, day)} />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => handleAddMeal(day, mealType)}
                        className="w-full mt-1 p-1 text-sm flex items-center justify-center text-[#3c4c42] hover:bg-[#f4f4f4] rounded"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </button>
                    </div>
                  ))}
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {editingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Editar Comida</h3>
            {/* Add your edit form here */}
            <button 
              onClick={() => setEditingMeal(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default WeeklyPlanner; 