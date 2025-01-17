import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/form.css';
import NuevaRecetaForm from './components/NuevaRecetaForm';
import NuevoPlanForm from './components/NuevoPlanForm';
import Recetas from './components/Recetas';
import Planes from './components/Planes';
import Sidebar from './components/Sidebar';
import Cuenta from './components/Cuenta';
import RecipeCard from './components/recipeCard';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="App-header">
          <h1>The Menu Company</h1>
        </header>
        <Sidebar />
        <div className="content">

          <main>
            <Routes>
              <Route path="/nueva-receta" element={<NuevaRecetaForm />} />
              <Route path="/nuevo-plan" element={<NuevoPlanForm />} />
              <Route path="/recetas" element={<Recetas />} />
              <Route path="/planes" element={<Planes />} />
              <Route path="/mi-cuenta" element={<Cuenta />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;