import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <nav className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li>
                    <NavLink to="/planes" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Planes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/recetas" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Recetas
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mi-cuenta" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Mi cuenta
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;