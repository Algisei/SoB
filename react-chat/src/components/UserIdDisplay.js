// components/UserIdDisplay.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const UserIdDisplay = ({ uniqueId }) => {
  return (
    <Box 
      sx={{ 
        mt: 2, 
        p: 2, 
        bgcolor: 'background.default', 
        borderRadius: 1, 
        boxShadow: 1,
        border: '1px solid', 
        borderColor: 'divider' 
      }}
    >
      <Typography variant="body1">
        {uniqueId}
      </Typography>
    </Box>
  );
};

export default UserIdDisplay;

