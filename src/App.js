import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/form.css';
import { Search, Mic, Camera, Upload, Clock, Calendar, ChefHat, ShoppingBag, Heart, Bell, Menu, X, User } from 'lucide-react';

//import Home from './components/Home';
import RecipeList from './components/recipeList';
import Recipes from './components/Recetas';
//import PlanList from './components/PlanList';
import Planes from './components/Planes';
import NuevaRecetaForm from './components/NuevaRecetaForm';
import NuevoPlanForm from './components/NuevoPlanForm';
import Sidebar from './components/Sidebar';
import MenuWebsite from './components/menu-website';
import Cuenta from './components/Cuenta';
import WeeklyPlanner from './components/WeeklyPlanner';
import RecipeExplorer from './components/RecipeExplorer';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="App-header">
          <h1>The Menu Company</h1>
        </header>
        <Sidebar />
        <main>
          <Routes>
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/new-recipe" element={<NuevaRecetaForm />} />
            <Route path="/new-plan" element={<NuevoPlanForm />} />
            <Route path="/meal-plan" element={<Planes />} />
            <Route path="/weekly-planner" element={<WeeklyPlanner />} />
            <Route path="/explore" element={<RecipeExplorer />} />
            <Route path="/menu" element={<MenuWebsite />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;