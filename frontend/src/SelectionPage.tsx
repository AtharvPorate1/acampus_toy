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
        <div className="course-section">
          <h3>Continue with last Course</h3>
          <div className="course-cards">
            <div className="course-card">
              <img src="/thermodynamics-icon.png" alt="Thermodynamics" />
              <h4>Thermodynamics</h4>
              <p>75% Completed</p>
            </div>
            <div className="course-card">
              <img src="/trigonometry-icon.png" alt="Trigonometry" />
              <h4>Trigonometry</h4>
              <p>60% Completed</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer">
        <img src="/cat-icon.png" alt="Cat Icon" className="cat-icon" />
      </footer>
    </div>
  );
};

export default SelectionPage;