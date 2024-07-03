// Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './style/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <NavLink to="/courseroom" activeClassName="active" className="nav-link">
        Home
      </NavLink>
      <NavLink to="/reviseroom" activeClassName="active" className="nav-link">
        Revise
      </NavLink>
      <NavLink to="/testroom" activeClassName="active" className="nav-link">
        Test
      </NavLink>
    </nav>
  );
};

export default Navbar;
