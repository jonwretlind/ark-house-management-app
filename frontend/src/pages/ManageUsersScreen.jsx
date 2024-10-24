import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import axios from '../utils/api';
import UserCard from '../components/UserCard';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import AddIcon from '@mui/icons-material/Add';
import UserForm from '../components/UserForm';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCloseForm = () => {
    setUserFormOpen(false);
    setSelectedUser(null);
  };

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: 2,
    marginBottom: 2,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <AppBar 
          position="sticky"
          elevation={0} 
          sx={{ 
            backgroundColor: theme.palette.primary.main,
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
            boxShadow: (theme) => `0 4px 20px rgba(0,0,0,0.6)`,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => navigate('/dashboard')}
              edge="start"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Manage Users
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          mt: 4,
          mb: 4,
          padding: '2rem',
        }}>
          <Box sx={{ ...glassyBoxStyle, position: 'relative', minHeight: '200px' }}>
            {users.map((user) => (
              <UserCard 
                key={user._id} 
                user={user} 
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}

            <Button 
              onClick={() => setUserFormOpen(true)} 
              sx={{ 
                position: 'absolute',
                bottom: 16,
                right: 16,
                ...glassyBoxStyle,
                width: 56,
                height: 56,
                minWidth: 56,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }} 
              aria-label="add user"
            >
              <AddIcon />
            </Button>
          </Box>
        </Container>

        <UserForm 
          open={userFormOpen} 
          handleClose={handleCloseForm} 
          refreshUsers={fetchUsers}
          user={selectedUser}
        />
      </Box>
    </ThemeProvider>
  );
};

export default ManageUsersScreen;
