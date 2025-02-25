// src/components/Sidebar.js
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiBook, FiCalendar, FiPlusCircle, FiHome, FiFilePlus, FiList, FiSettings } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    return (
        <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
            <button onClick={toggleSidebar} className="toggle-btn">
                <FiMenu size={24} />
            </button>
            
            <nav>
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiHome className="mr-2" />
                    {isOpen && <span>Home</span>}
                </NavLink>
                <NavLink
                    to="/recipes"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiBook className="mr-2" />
                    {isOpen && <span>Recipes</span>}
                </NavLink>
                <NavLink
                    to="/new-recipe"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiPlusCircle className="mr-2" />
                    {isOpen && <span>New Recipe</span>}
                </NavLink>
                <NavLink
                    to="/meal-plans"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiCalendar className="mr-2" />
                    {isOpen && <span>Meal Plans</span>}
                </NavLink>
                <NavLink
                    to="/new-plan"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiFilePlus className="mr-2" />
                    {isOpen && <span>New Plan</span>}
                </NavLink>
                <NavLink
                    to="/menu"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiList className="mr-2" />
                    {isOpen && <span>Menu</span>}
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FiSettings className="mr-2" />
                    {isOpen && <span>Settings</span>}
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
