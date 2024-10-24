// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import Dashboard from './pages/Dashboard';
import EventsScreen from './pages/EventsScreen';
import RegisterUser from './pages/RegisterUser';
import GlobalStyles from './components/GlobalStyles';
import ManageUsersScreen from './pages/ManageUsersScreen';
import LeaderboardScreen from './pages/LeaderboardScreen';
import CompletedTasksScreen from './pages/CompletedTasksScreen';
import AllTasksScreen from './pages/AllTasksScreen';

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventsScreen />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/manage-users" element={<ManageUsersScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/completed-tasks" element={<CompletedTasksScreen />} />
        <Route path="/all-tasks" element={<AllTasksScreen />} />
      </Routes>
    </>
  );
};

export default App;
