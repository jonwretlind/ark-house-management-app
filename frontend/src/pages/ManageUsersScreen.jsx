import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  AppBar
} from '@mui/material';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (currentUser?.isSuperAdmin) {
      fetchUsers(selectedGroupId === 'all' ? '' : selectedGroupId);
    }
  }, [selectedGroupId]);

  const initialize = async () => {
    setIsLoading(true);
    setError('');
    try {
      const meResponse = await axios.get('/auth/me', { withCredentials: true });
      const me = meResponse.data;
      setCurrentUser(me);

      if (!me?.isAdmin) {
        setError('Admin access is required to manage users.');
        return;
      }

      if (me?.isSuperAdmin) {
        const groupsResponse = await axios.get('/groups', { withCredentials: true });
        setGroups(groupsResponse.data || []);
      }

      await fetchUsers();
    } catch (initError) {
      setError(initError.response?.data?.message || 'Failed to load users page');
      if (initError.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (groupId = '') => {
    try {
      const query = groupId ? `?groupId=${groupId}` : '';
      const response = await axios.get(`/users${query}`, { withCredentials: true });
      setUsers(response.data);
      setError('');
    } catch (error) {
      setUsers([]);
      setError(error.response?.data?.message || 'Error fetching users');
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = (user) => {
    setError('');
    setSuccess('');
    setSelectedUser(user);
    setUserFormOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/users/${userId}`, { withCredentials: true });
      setSuccess('User deleted successfully.');
      fetchUsers(currentUser?.isSuperAdmin && selectedGroupId !== 'all' ? selectedGroupId : '');
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const handleCloseForm = () => {
    setUserFormOpen(false);
    setSelectedUser(null);
    setError('');
  };

  const refreshUsers = () => {
    setSuccess(selectedUser ? 'User updated successfully.' : 'User created successfully.');
    fetchUsers(currentUser?.isSuperAdmin && selectedGroupId !== 'all' ? selectedGroupId : '');
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

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

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
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

          {currentUser?.isSuperAdmin ? (
            <Box sx={{ ...glassyBoxStyle, mb: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="group-filter-label">Filter by Group</InputLabel>
                  <Select
                    labelId="group-filter-label"
                    label="Filter by Group"
                    value={selectedGroupId}
                    onChange={(event) => setSelectedGroupId(event.target.value)}
                  >
                    <MenuItem value="all">All Groups</MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name} ({group.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="outlined" onClick={() => navigate('/manage-groups')}>
                  Manage Groups
                </Button>
              </Stack>
            </Box>
          ) : null}

          <Box sx={{ ...glassyBoxStyle, position: 'relative', minHeight: '200px' }}>
            {!users.length ? (
              <Typography sx={{ opacity: 0.8 }}>No users found for this view.</Typography>
            ) : null}
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
          refreshUsers={refreshUsers}
          user={selectedUser}
          currentUser={currentUser}
          groups={groups}
        />
      </Box>
    </ThemeProvider>
  );
};

export default ManageUsersScreen;
