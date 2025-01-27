import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/form.css';

//import Home from './components/Home';
import RecipeList from './components/recipeList';
import Recipes from './components/Recetas';
//import PlanList from './components/PlanList';
import NuevaRecetaForm from './components/NuevaRecetaForm';
import NuevoPlanForm from './components/NuevoPlanForm';
import Sidebar from './components/Sidebar';
import Cuenta from './components/Cuenta';


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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;