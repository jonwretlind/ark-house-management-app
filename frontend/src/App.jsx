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
import ManageMessages from './pages/ManageMessages';
import MessagesScreen from './pages/MessagesScreen';
import ProfileScreen from './pages/ProfileScreen';

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
        <Route path="/manage-messages" element={<ManageMessages />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </>
  );
};

export default App;
