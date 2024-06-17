// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './views/homepage';
import RadioPage from './views/radiopage';
import GamesPage from './views/games';
import SignUpPage from './views/signup';
import LoginPage from './views/login';
import ProfilePage from './views/profile';
import LatestPage from './views/latest';
import { AuthProvider } from './AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/radiopage" element={<RadioPage />} />
            <Route path="/gamespage" element={<GamesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/latest" element={<LatestPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
