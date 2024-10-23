// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import Dashboard from './pages/Dashboard';
import GlobalStyles from './components/GlobalStyles';

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
