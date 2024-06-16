import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './views/homepage';
import RadioPage from './views/radiopage';
import GamesPage from './views/games';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/radiopage" element={<RadioPage />} />
          <Route path="/gamespage" element={<GamesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
