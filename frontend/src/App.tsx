import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Revise from './Revise';
import Test from './Test';
import './App.css';
import Navbar from './components/Navbar';
import CoursePage from './routes/CoursePage';
import SelectionPage from './SelectionPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<SelectionPage />} />
          <Route path="/courseroom" element={<Home />} />
          <Route path="/reviseroom" element={<Revise />} />
          <Route path="/testroom" element={<Test />} />
          <Route path="/courseroom/:userEnteredTopic/:chapterName" element={<CoursePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;