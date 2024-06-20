// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './views/homepage';
import RadioPage from './views/radiopage';
import BookPage from './views/bookspage';
import GamesPage from './views/games';
import SignUpPage from './views/signup';
import LoginPage from './views/login';
import ProfilePage from './views/profile';
import LatestPage from './views/latest';
import FavoritesPage from './views/favourite';
import { AuthProvider } from './AuthContext';
import './App.css';
import PasswordReset from './views/resetPasswordOTP';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/radiopage" element={<RadioPage />} />
            <Route path="/bookspage" element={<BookPage />} />
            <Route path="/gamespage" element={<GamesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/latest" element={<LatestPage />} />
            <Route path="/favourites" element={<FavoritesPage/>} />
            <Route path="/resetpasswordOTP" element={<PasswordReset/>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
