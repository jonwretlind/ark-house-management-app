// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../utils/api'; // Axios instance for API calls
import AdminTaskTable from '../components/AdminTaskTable'; // Admin task management
import UserAvatar from '../components/UserAvatar'; // User avatar and info display
import TaskList from '../components/TaskList'; // Task list for non-admins
import StartScreen from './_StartScreen'; // Start screen if not authenticated

const Dashboard = () => {
  const [user, setUser] = useState(null); // Track user state
  const [tasks, setTasks] = useState([]); // Store tasks
  const [isAdmin, setIsAdmin] = useState(false); // Check if user is admin

  // Check for session cookie on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current logged-in user's information
        const userResponse = await axios.get('/auth/me', { withCredentials: true });
        setUser(userResponse.data);
        setIsAdmin(userResponse.data.isAdmin);

        // Fetch tasks and sort them by priority and points
        const tasksResponse = await axios.get('/tasks', { withCredentials: true });
        const sortedTasks = tasksResponse.data.sort(
          (a, b) => b.priority - a.priority || b.points - a.points
        );
        setTasks(sortedTasks);
      } catch (error) {
        console.error('User not authenticated or session expired:', error);
        setUser(null); // Clear user state if not authenticated
      }
    };

    fetchData();
  }, []);

  // Logout function to clear the session cookie
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setUser(null); // Clear user state on logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Display StartScreen if the user is not authenticated
  if (!user) return <StartScreen />;

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Display User Avatar and Info */}
      <UserAvatar user={user} />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{ margin: '1rem', padding: '0.5rem 1rem' }}
      >
        Logout
      </button>

      {/* Render AdminTaskTable or TaskList Based on User Role */}
      {isAdmin ? <AdminTaskTable /> : <TaskList tasks={tasks} />}
    </div>
  );
};

export default Dashboard;
