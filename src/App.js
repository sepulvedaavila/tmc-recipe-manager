// Boilerplate React Project Code
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import './App.css';
import './styles/form.css';
import NuevaRecetaForm from './components/NuevaRecetaForm';
import NuevoPlanForm from './components/NuevoPlanForm';
import Recipes from './components/Recetas';
import Plans from './components/Planes';
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
        <div className="content">
          <main>
            <Routes>
              <Route path="/nueva-receta" element={<NuevaRecetaForm />} />
              <Route path="/nuevo-plan" element={<NuevoPlanForm />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/mi-cuenta" element={<Cuenta />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;