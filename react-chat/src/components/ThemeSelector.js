import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function ThemeSelector({ currentTheme, setTheme }) {
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Theme Preset</InputLabel>
      <Select value={currentTheme} label="Theme Preset" onChange={handleThemeChange}>
        {/* <MenuItem value="neutral">Neutral</MenuItem> */}
        <MenuItem value="retro">Retro 80s CRT</MenuItem>
        <MenuItem value="win31">Windows 3.1 Aesthetic</MenuItem>
        <MenuItem value="synthwave">Synthwave</MenuItem>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
    </FormControl>
  );
}

export default ThemeSelector;
