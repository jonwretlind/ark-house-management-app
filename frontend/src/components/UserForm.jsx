import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import axios from '../utils/api';
import CustomDialog from './CustomDialog';

const UserForm = ({ open, handleClose, refreshUsers, user }) => {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', password: '', isAdmin: false });

  useEffect(() => {
    if (user) {
      setUserData({ ...user, password: '' });
    } else {
      setUserData({ name: '', email: '', phone: '', password: '', isAdmin: false });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setUserData({ ...userData, [name]: name === 'isAdmin' ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      if (user) {
        await axios.put(`/users/${user._id}`, userData, { withCredentials: true });
      } else {
        await axios.post('/users', userData, { withCredentials: true });
      }
      refreshUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={user ? 'Edit User' : 'Create New User'}
    >
      <TextField fullWidth margin="normal" name="name" label="Name" value={userData.name} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="email" label="Email" value={userData.email} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="phone" label="Phone" value={userData.phone} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="password" label="Password" type="password" value={userData.password} onChange={handleChange} />
      <FormControlLabel
        control={<Checkbox checked={userData.isAdmin} onChange={handleChange} name="isAdmin" />}
        label="Is Admin"
      />
    </CustomDialog>
  );
};

export default UserForm;
