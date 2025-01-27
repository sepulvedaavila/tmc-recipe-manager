// src/components/Sidebar.js
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiBook, FiCalendar, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      
      <nav>
        <NavLink to="/" className="nav-item">
          <FiHome /> {isOpen && 'Home'}
        </NavLink>
        <NavLink to="/recipes" className="nav-item">
          <FiBook /> {isOpen && 'Recipes'}
        </NavLink>
        <NavLink to="/meal-plan" className="nav-item">
          <FiCalendar /> {isOpen && 'Meal Plans'}
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <FiSettings /> {isOpen && 'Settings'}
        </NavLink>
      </nav>
    </div>
  );
};
