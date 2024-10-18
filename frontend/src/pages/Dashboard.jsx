// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api'; // Axios instance for API calls
import AdminTaskTable from '../components/AdminTaskTable'; // Admin task management
import UserAvatar from '../components/UserAvatar'; // User avatar and info display
import TaskList from '../components/TaskList'; // Task list for non-admins
import StartScreen from './StartScreen'; // Start screen if not authenticated

const Dashboard = () => {
  const [user, setUser] = useState(null); // Track user state
  const [tasks, setTasks] = useState([]); // Store tasks
  const [isAdmin, setIsAdmin] = useState(false); // Track admin status
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // React Router navigation hook

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/auth/me', { withCredentials: true });
        setUser(userResponse.data);
        setIsAdmin(userResponse.data.isAdmin);

        // Fetch tasks if the user is authenticated
        const tasksResponse = await axios.get('/tasks', { withCredentials: true });
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Authentication failed, redirecting to login...');
        navigate('/'); // Redirect to StartScreen if authentication fails
      } finally {
        setLoading(false); // Ensure loading state is cleared
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function to clear the session cookie
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setUser(null); // Clear user state on logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) return <p>Loading...</p>; // Avoid rendering during loading


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
      {isAdmin ? <AdminTaskTable tasks={tasks} setTasks={setTasks} /> : <TaskList tasks={tasks} />}
    </div>
  );
};

export default Dashboard;
