// components/AppDrawer.js
import React, { useState } from 'react';
import { Drawer, IconButton, Box, Typography } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import Draggable from 'react-draggable';

const icons = [
  { id: 1, label: 'App 1', imageUrl: 'https://via.placeholder.com/50', link: '#', position: { x: 0, y: 0 } },
  { id: 2, label: 'App 2', imageUrl: 'https://via.placeholder.com/50', link: '#', position: { x: 0, y: 60 } },
  { id: 3, label: 'App 3', imageUrl: 'https://via.placeholder.com/50', link: '#', position: { x: 0, y: 120 } },
];

const AppDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [iconPositions, setIconPositions] = useState(
    icons.reduce((acc, icon) => {
      acc[icon.id] = icon.position;
      return acc;
    }, {})
  );

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleDragStop = (e, data, iconId) => {
    setIconPositions((prevPositions) => ({
      ...prevPositions,
      [iconId]: { x: data.x, y: data.y },
    }));
  };

  return (
    <>
      <IconButton onClick={toggleDrawer} sx={{ position: 'fixed', right: 0, top: '50%' }}>
        <AppsIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{ '& .MuiDrawer-paper': { width: 200, padding: 2, bgcolor: 'background.paper' } }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>Applications</Typography>
        {icons.map((icon) => (
          <Draggable
            key={icon.id}
            position={iconPositions[icon.id]}
            onStop={(e, data) => handleDragStop(e, data, icon.id)}
          >
            <Box
              component="a"
              href={icon.link}
              sx={{
                display: 'block',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                borderRadius: 1,
                overflow: 'hidden',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'absolute',
                top: iconPositions[icon.id].y,
                left: iconPositions[icon.id].x,
              }}
            >
              <img src={icon.imageUrl} alt={icon.label} style={{ width: '100%', height: '100%' }} />
            </Box>
          </Draggable>
        ))}
      </Drawer>
    </>
  );
};

export default AppDrawer;
