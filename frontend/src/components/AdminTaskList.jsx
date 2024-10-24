import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';

const AdminTaskList = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="admin task tabs">
        <Tab label="All Tasks" />
        <Tab label="Unassigned" />
        <Tab label="My Tasks" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {/* All Tasks content */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Unassigned Tasks content */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* My Tasks content */}
      </TabPanel>
    </div>
  );
};

export default AdminTaskList;
