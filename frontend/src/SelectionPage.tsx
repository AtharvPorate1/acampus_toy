import React from 'react';
import { Link } from 'react-router-dom';
import './SelectionPage.css';

const SelectionPage: React.FC = () => {
  return (
    <div className="selection-container">
      <header className="header">
        <h1>acampus.ai</h1>
        <button className="premium-button">Get Premium</button>
        <div className="user-icon">👤</div>
      </header>
      <main className="main-content">
        <h2>Hello Atharv!</h2>
        <div className="rooms-container">
          <Link to="/courseroom" className="room-button">Classroom</Link>
          <Link to="/testroom" className="room-button">Test Room</Link>
          <Link to="/reviseroom" className="room-button">Revise Room</Link>
        </div>
        
      </main>
      
    </div>
  );
};

export default SelectionPage;