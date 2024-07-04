// Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './style/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <NavLink to="/courseroom"  className="nav-link">
        Learn
      </NavLink>
      <NavLink to="/reviseroom"  className="nav-link">
        Revise
      </NavLink>
      <NavLink to="/testroom"  className="nav-link">
        Test
      </NavLink>
    </nav>
  );
};

export default Navbar;
