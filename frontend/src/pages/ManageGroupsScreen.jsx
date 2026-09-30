import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';

const initialForm = {
  name: '',
  code: '',
  location: '',
  isActive: true
};

const ManageGroupsScreen = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/groups', { withCredentials: true });
      setGroups(response.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch groups');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const meResponse = await axios.get('/auth/me', { withCredentials: true });
        if (!meResponse.data?.isSuperAdmin) {
          setError('Superadmin access is required to manage groups.');
          setLoading(false);
          return;
        }
        await fetchGroups();
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/');
          return;
        }
        setError(err.response?.data?.message || 'Failed to initialize groups page');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setEditingGroupId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingGroupId) {
        await axios.put(`/groups/${editingGroupId}`, formData, { withCredentials: true });
        setSuccess('Group updated successfully.');
      } else {
        await axios.post('/groups', formData, { withCredentials: true });
        setSuccess('Group created successfully.');
      }
      await fetchGroups();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save group');
    }
  };

  const handleEdit = (group) => {
    setEditingGroupId(group._id);
    setFormData({
      name: group.name || '',
      code: group.code || '',
      location: group.location || '',
      isActive: group.isActive !== false
    });
  };

  const handleDelete = async (groupId) => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/groups/${groupId}`, { withCredentials: true });
      await fetchGroups();
      setSuccess('Group deleted successfully.');
      if (editingGroupId === groupId) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete group');
    }
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
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => navigate('/dashboard')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Manage Groups
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

          <Paper sx={glassyBoxStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {editingGroupId ? 'Edit Group' : 'Create Group'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Group Name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                name="code"
                label="Group Code"
                fullWidth
                margin="normal"
                value={formData.code}
                onChange={handleChange}
                required
              />
              <TextField
                name="location"
                label="Location"
                fullWidth
                margin="normal"
                value={formData.location}
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Switch checked={formData.isActive} onChange={handleChange} name="isActive" />}
                label="Active"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button type="submit" variant="contained">
                  {editingGroupId ? 'Update Group' : 'Create Group'}
                </Button>
                {editingGroupId ? (
                  <Button type="button" variant="outlined" onClick={resetForm}>
                    Cancel
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Paper>

          <Paper sx={glassyBoxStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Existing Groups
            </Typography>
            {groups.map((group) => (
              <Box
                key={group._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{group.name}</Typography>
                  <Typography variant="body2">
                    Code: {group.code} | Location: {group.location || 'N/A'} | Status: {group.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => handleEdit(group)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(group._id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ManageGroupsScreen;
