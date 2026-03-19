import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/api';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import UserAvatar from '../components/UserAvatar';
import { formatAvatarUrl } from '../utils/avatarHelper';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/auth/me');
      const userData = response.data;
      if (userData.birthday) {
        userData.birthday = new Date(userData.birthday).toISOString().split('T')[0];
      }
      setUser(userData);
      setEditedUser(userData);
      console.log('Fetched user data:', userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/');
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditedUser({...user});
    } else {
      setEditedUser({...user});
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
    console.log('Updated editedUser:', { ...editedUser, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...editedUser,
        birthday: editedUser.birthday ? new Date(editedUser.birthday).toISOString() : null
      };

      const response = await axios.put('/users/profile', dataToSend);
      const updatedUser = response.data;
      
      if (updatedUser.birthday) {
        updatedUser.birthday = new Date(updatedUser.birthday).toISOString().split('T')[0];
      }
      
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setEditMode(false);
      setSuccess('Profile updated successfully');
      
      await fetchUserData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Error updating profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    try {
      await axios.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Password updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating password');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Avatar upload response:', response.data);
      
      const updatedUser = { ...user, avatarUrl: response.data.avatarUrl };
      setUser(updatedUser);
      setEditedUser(updatedUser);
      
      setSuccess('Avatar updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Error uploading avatar');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (!user) return null;

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
            backgroundColor: '#1a4731',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
              My Profile
            </Typography>
            <IconButton color="inherit" onClick={handleEditToggle}>
              <EditIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Paper sx={{
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  alt={user.name}
                  src={formatAvatarUrl(user.avatarUrl)}
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 2,
                    border: '3px solid white',
                    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                  }}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="avatar-upload"
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpload}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      right: -10,
                      backgroundColor: '#1a4731',
                      color: 'white',
                      '&:hover': { backgroundColor: '#2c3e50' }
                    }}
                  >
                    <CameraAltIcon />
                  </IconButton>
                </label>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={editMode ? editedUser.name || '' : user.name || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .Mui-disabled': {
                    color: 'black !important',
                    WebkitTextFillColor: 'black !important',
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                value={editMode ? editedUser.email || '' : user.email || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .Mui-disabled': {
                    color: 'black !important',
                    WebkitTextFillColor: 'black !important',
                  },
                }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={editMode ? editedUser.phone || '' : user.phone || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .Mui-disabled': {
                    color: 'black !important',
                    WebkitTextFillColor: 'black !important',
                  },
                }}
              />
              <TextField
                label="Birthday"
                name="birthday"
                type="date"
                value={editMode ? editedUser.birthday || '' : (user.birthday ? user.birthday.split('T')[0] : '')}
                onChange={handleInputChange}
                disabled={!editMode}
                InputLabelProps={{ 
                  shrink: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontWeight: 500,
                  },
                  '& .Mui-disabled': {
                    color: 'black !important',
                    WebkitTextFillColor: 'black !important',
                  },
                }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => setPasswordDialog(true)}
                  sx={{
                    backgroundColor: '#1a4731',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2c3e50',
                    },
                  }}
                >
                  Change Password
                </Button>

                {editMode && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <IconButton
                      onClick={handleSave}
                      sx={{
                        backgroundColor: '#1a4731',
                        color: 'white',
                        width: '48px',
                        height: '48px',
                        '&:hover': {
                          backgroundColor: '#2c3e50',
                        },
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setEditMode(false)}
                      sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        width: '48px',
                        height: '48px',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePasswordUpdate();
          }}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  autoComplete="current-password"
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  autoComplete="new-password"
                />
                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  autoComplete="new-password"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Update Password
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ProfileScreen; 