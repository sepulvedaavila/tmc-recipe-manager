// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiBook, FiCalendar, FiPlusCircle, FiHome, FiFilePlus, FiList, FiSettings } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    //const location = useLocation();

    return (
        <>
            <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Recipe Plan</h2>
                    <button 
                        className={`hamburger-button ${!isOpen ? 'active' : ''}`}
                        onClick={toggleSidebar}
                        aria-label="Close menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiHome size={20} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink
                        to="/recipes"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiBook size={20} />
                        <span>Recipes</span>
                    </NavLink>
                    <NavLink
                        to="/new-recipe"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiPlusCircle size={20} />
                        <span>New Recipe</span>
                    </NavLink>
                    <NavLink
                        to="/meal-plans"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiCalendar size={20} />
                        <span>Meal Plans</span>
                    </NavLink>
                    <NavLink
                        to="/new-plan"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiFilePlus size={20} />
                        <span>New Plan</span>
                    </NavLink>
                    <NavLink
                        to="/menu"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiList size={20} />
                        <span>Menu</span>
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <FiSettings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </div>
            
            {/* Button to show sidebar when collapsed */}
            <button 
                className="hamburger-button-collapsed"
                onClick={toggleSidebar}
                aria-label="Open menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </>
    );
};

export default Sidebar;
