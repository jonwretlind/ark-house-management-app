// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

export const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');  // Check if the user is authenticated
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Start Screen */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <StartScreen />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};