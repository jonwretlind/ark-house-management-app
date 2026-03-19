import React, { useState, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import axios from '../utils/api';
import CustomDialog from './CustomDialog';

const UserForm = ({ open, handleClose, refreshUsers, user, currentUser, groups = [] }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'resident',
    groupId: ''
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        role: user.role || (user.isAdmin ? 'admin' : 'resident'),
        groupId: user.group?.id || ''
      });
    } else {
      setUserData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'resident',
        groupId: currentUser?.group?.id || ''
      });
    }
  }, [user, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...userData,
        groupId: userData.role === 'superadmin' ? null : userData.groupId || undefined
      };

      if (user) {
        await axios.put(`/users/${user._id}`, payload, { withCredentials: true });
      } else {
        await axios.post('/users', payload, { withCredentials: true });
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
      <TextField
        select
        fullWidth
        margin="normal"
        name="role"
        label="Role"
        value={userData.role}
        onChange={handleChange}
      >
        <MenuItem value="resident">Resident</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        {currentUser?.isSuperAdmin ? <MenuItem value="superadmin">Superadmin</MenuItem> : null}
      </TextField>
      {currentUser?.isSuperAdmin ? (
        <TextField
          select
          fullWidth
          margin="normal"
          name="groupId"
          label="Group"
          value={userData.groupId || ''}
          onChange={handleChange}
          disabled={userData.role === 'superadmin'}
        >
          {groups.map((group) => (
            <MenuItem key={group._id} value={group._id}>
              {group.name} ({group.code})
            </MenuItem>
          ))}
        </TextField>
      ) : null}
    </CustomDialog>
  );
};

export default UserForm;
