import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/form.css';
import './styles/NuevaRecetaForm.css';

//import Home from './components/Home';
import RecipeList from './components/recipeList';
//import Recipes from './components/Recetas';
//import PlanList from './components/PlanList';
//import Planes from './components/Planes';
import NuevaRecetaForm from './components/NuevaRecetaForm';
import NuevoPlanForm from './components/NuevoPlanForm';
import Sidebar from './components/Sidebar';
import MenuWebsite from './components/menu-website';
import Cuenta from './components/Cuenta';
import MealPlanList from './components/MealPlanList';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/new-recipe" element={<NuevaRecetaForm />} />
          <Route path="/meal-plans" element={<MealPlanList />} />
          <Route path="/new-plan" element={<NuevoPlanForm />} />
          <Route path="/menu" element={<MenuWebsite />} />
          <Route path="/settings" element={<Cuenta />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;