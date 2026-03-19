import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for light-colored tabs
const LightTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const LightTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.grey[300],
  '&.Mui-selected': {
    color: theme.palette.common.white,
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const AdminTaskList = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LightTabs 
        value={value} 
        onChange={handleChange} 
        aria-label="admin task tabs"
        sx={{ 
          '& .MuiTabs-flexContainer': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          '& .MuiTab-root': {
            minWidth: 'auto',
            padding: '6px 12px',
          },
        }}
      >
        <LightTab label="All Tasks" />
        <LightTab label="Unassigned" />
        <LightTab label="My Tasks" />
      </LightTabs>
      <TabPanel value={value} index={0}>
        {/* All Tasks content */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Unassigned Tasks content */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* My Tasks content */}
      </TabPanel>
    </Box>
  );
};

export default AdminTaskList;
