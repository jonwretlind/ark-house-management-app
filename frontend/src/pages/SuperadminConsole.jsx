import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';

const initialGroupForm = {
  name: '',
  code: '',
  location: '',
  isActive: true,
  logoUrl: '',
  loginBackgroundUrl: '',
  appBackgroundUrl: '',
  primaryColor: '#1a4731',
  secondaryColor: '#d35400',
  accentColor: '#2c3e50',
  textColor: '#ecf0f1'
};

const SuperadminConsole = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('users');

  const [currentUser, setCurrentUser] = useState(null);

  const [groups, setGroups] = useState([]);
  const [groupForm, setGroupForm] = useState(initialGroupForm);
  const [editingGroupId, setEditingGroupId] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('all');
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: 2,
    marginBottom: 2
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const fetchGroups = async () => {
    const response = await axios.get('/groups', { withCredentials: true });
    setGroups(response.data || []);
  };

  const fetchUsers = async (groupId = '') => {
    const query = groupId ? `?groupId=${groupId}` : '';
    const response = await axios.get(`/users${query}`, { withCredentials: true });
    setUsers(response.data || []);
  };

  const initialize = async () => {
    setLoading(true);
    clearMessages();

    try {
      const meResponse = await axios.get('/auth/me', { withCredentials: true });
      const me = meResponse.data;

      if (!me?.isSuperAdmin) {
        setError('Superadmin access is required.');
        setLoading(false);
        return;
      }

      setCurrentUser(me);
      await fetchGroups();
      await fetchUsers();
    } catch (initError) {
      if (initError.response?.status === 401) {
        navigate('/');
        return;
      }
      setError(initError.response?.data?.message || 'Failed to load superadmin console');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const groupId = selectedGroupId === 'all' ? '' : selectedGroupId;
    fetchUsers(groupId).catch((usersError) => {
      setError(usersError.response?.data?.message || 'Failed to load users');
      setUsers([]);
    });
  }, [selectedGroupId, currentUser]);

  const handleGroupFormChange = (event) => {
    const { name, value, checked, type } = event.target;
    clearMessages();
    setGroupForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetGroupForm = () => {
    setEditingGroupId(null);
    setGroupForm(initialGroupForm);
  };

  const handleSaveGroup = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      const payload = {
        name: groupForm.name,
        code: groupForm.code,
        location: groupForm.location,
        isActive: groupForm.isActive,
        branding: {
          logoUrl: groupForm.logoUrl,
          loginBackgroundUrl: groupForm.loginBackgroundUrl,
          appBackgroundUrl: groupForm.appBackgroundUrl,
          primaryColor: groupForm.primaryColor,
          secondaryColor: groupForm.secondaryColor,
          accentColor: groupForm.accentColor,
          textColor: groupForm.textColor
        }
      };

      if (editingGroupId) {
        await axios.put(`/groups/${editingGroupId}`, payload, { withCredentials: true });
        setSuccess('Group updated successfully.');
      } else {
        await axios.post('/groups', payload, { withCredentials: true });
        setSuccess('Group created successfully.');
      }

      await fetchGroups();
      resetGroupForm();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Failed to save group');
    }
  };

  const handleEditGroup = (group) => {
    clearMessages();
    setEditingGroupId(group._id);
    setGroupForm({
      name: group.name || '',
      code: group.code || '',
      location: group.location || '',
      isActive: group.isActive !== false,
      logoUrl: group.branding?.logoUrl || '',
      loginBackgroundUrl: group.branding?.loginBackgroundUrl || '',
      appBackgroundUrl: group.branding?.appBackgroundUrl || '',
      primaryColor: group.branding?.primaryColor || '#1a4731',
      secondaryColor: group.branding?.secondaryColor || '#d35400',
      accentColor: group.branding?.accentColor || '#2c3e50',
      textColor: group.branding?.textColor || '#ecf0f1'
    });
  };

  const handleDeleteGroup = async (groupId) => {
    clearMessages();

    try {
      await axios.delete(`/groups/${groupId}`, { withCredentials: true });
      setSuccess('Group deleted successfully.');

      await fetchGroups();

      if (editingGroupId === groupId) {
        resetGroupForm();
      }

      if (selectedGroupId === groupId) {
        setSelectedGroupId('all');
      }
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Failed to delete group');
    }
  };

  const handleOpenCreateUser = () => {
    clearMessages();
    setSelectedUser(null);
    setUserFormOpen(true);
  };

  const handleEditUser = (user) => {
    clearMessages();
    setSelectedUser(user);
    setUserFormOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    clearMessages();

    try {
      await axios.delete(`/users/${userId}`, { withCredentials: true });
      setSuccess('User deleted successfully.');
      await fetchUsers(selectedGroupId === 'all' ? '' : selectedGroupId);
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCloseUserForm = () => {
    setUserFormOpen(false);
    setSelectedUser(null);
  };

  const refreshUsers = async () => {
    setSuccess(selectedUser ? 'User updated successfully.' : 'User created successfully.');
    await fetchUsers(selectedGroupId === 'all' ? '' : selectedGroupId);
  };

  if (loading) {
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
          backgroundAttachment: 'fixed'
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
            boxShadow: () => '0 4px 20px rgba(0,0,0,0.6)'
          }}
        >
          <Toolbar>
            <IconButton color="inherit" onClick={() => navigate('/dashboard')} edge="start">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Superadmin Console
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, padding: '2rem' }}>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

          <Paper sx={{ ...glassyBoxStyle, p: 1 }}>
            <Tabs
              value={activeTab}
              onChange={(_event, value) => {
                clearMessages();
                setActiveTab(value);
              }}
              textColor="inherit"
              indicatorColor="secondary"
              variant="fullWidth"
            >
              <Tab value="users" label="Users" />
              <Tab value="groups" label="Groups" />
            </Tabs>
          </Paper>

          {activeTab === 'users' ? (
            <>
              <Paper sx={glassyBoxStyle}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="superadmin-console-group-filter">Filter by Group</InputLabel>
                    <Select
                      labelId="superadmin-console-group-filter"
                      label="Filter by Group"
                      value={selectedGroupId}
                      onChange={(event) => {
                        clearMessages();
                        setSelectedGroupId(event.target.value);
                      }}
                    >
                      <MenuItem value="all">All Groups</MenuItem>
                      {groups.map((group) => (
                        <MenuItem key={group._id} value={group._id}>
                          {group.name} ({group.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateUser}>
                    Create User
                  </Button>
                </Box>
              </Paper>

              <Paper sx={glassyBoxStyle}>
                {!users.length ? (
                  <Typography sx={{ opacity: 0.85 }}>No users found for this filter.</Typography>
                ) : null}

                {users.map((user) => (
                  <UserCard key={user._id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                ))}
              </Paper>
            </>
          ) : null}

          {activeTab === 'groups' ? (
            <>
              <Paper sx={glassyBoxStyle}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {editingGroupId ? 'Edit Group' : 'Create Group'}
                </Typography>

                <Box component="form" onSubmit={handleSaveGroup}>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                      fullWidth
                      required
                      label="Group Name"
                      name="name"
                      value={groupForm.name}
                      onChange={handleGroupFormChange}
                    />

                    <TextField
                      fullWidth
                      required
                      label="Group Code"
                      name="code"
                      value={groupForm.code}
                      onChange={handleGroupFormChange}
                    />

                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={groupForm.location}
                      onChange={handleGroupFormChange}
                    />

                    <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                      Branding
                    </Typography>

                    <TextField
                      fullWidth
                      label="Logo URL"
                      name="logoUrl"
                      value={groupForm.logoUrl}
                      onChange={handleGroupFormChange}
                      placeholder="https://example.com/logo.png"
                    />

                    <TextField
                      fullWidth
                      label="Login Background URL"
                      name="loginBackgroundUrl"
                      value={groupForm.loginBackgroundUrl}
                      onChange={handleGroupFormChange}
                      placeholder="https://example.com/login-bg.jpg"
                    />

                    <TextField
                      fullWidth
                      label="App Background URL"
                      name="appBackgroundUrl"
                      value={groupForm.appBackgroundUrl}
                      onChange={handleGroupFormChange}
                      placeholder="https://example.com/app-bg.jpg"
                    />

                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                      <TextField
                        fullWidth
                        type="color"
                        label="Primary Color"
                        name="primaryColor"
                        value={groupForm.primaryColor}
                        onChange={handleGroupFormChange}
                        InputLabelProps={{ shrink: true }}
                      />

                      <TextField
                        fullWidth
                        type="color"
                        label="Secondary Color"
                        name="secondaryColor"
                        value={groupForm.secondaryColor}
                        onChange={handleGroupFormChange}
                        InputLabelProps={{ shrink: true }}
                      />

                      <TextField
                        fullWidth
                        type="color"
                        label="Accent Color"
                        name="accentColor"
                        value={groupForm.accentColor}
                        onChange={handleGroupFormChange}
                        InputLabelProps={{ shrink: true }}
                      />

                      <TextField
                        fullWidth
                        type="color"
                        label="Text Color"
                        name="textColor"
                        value={groupForm.textColor}
                        onChange={handleGroupFormChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>

                    <Box>
                      <Typography component="label" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <Switch checked={groupForm.isActive} onChange={handleGroupFormChange} name="isActive" />
                        Active
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button type="submit" variant="contained">
                        {editingGroupId ? 'Update Group' : 'Create Group'}
                      </Button>
                      {editingGroupId ? (
                        <Button type="button" variant="outlined" onClick={resetGroupForm}>
                          Cancel
                        </Button>
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={glassyBoxStyle}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Existing Groups
                </Typography>

                {!groups.length ? <Typography sx={{ opacity: 0.85 }}>No groups found.</Typography> : null}

                {groups.map((group) => (
                  <Box
                    key={group._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      gap: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{group.name}</Typography>
                      <Typography variant="body2">
                        Code: {group.code} | Location: {group.location || 'N/A'} | Status: {group.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => handleEditGroup(group)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteGroup(group._id)}>
                        Delete
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </>
          ) : null}
        </Container>

        <UserForm
          open={userFormOpen}
          handleClose={handleCloseUserForm}
          refreshUsers={refreshUsers}
          user={selectedUser}
          currentUser={currentUser}
          groups={groups}
        />
      </Box>
    </ThemeProvider>
  );
};

export default SuperadminConsole;
