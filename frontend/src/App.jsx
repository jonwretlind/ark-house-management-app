// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';  // Ensure you have a login page
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import TaskList from './components/TaskList';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Start Screen */}
          <Route path="/" element={<StartScreen />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* User Registrations and Login */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};