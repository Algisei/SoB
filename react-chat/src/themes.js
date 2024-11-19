import { createTheme } from '@mui/material/styles';

// Тема "Ретро" в стиле 80-х (CRT-мониторы)
export const retroTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00', // Неоновый зеленый цвет
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a', // Темные цвета как на старых мониторах
    },
    text: {
      primary: '#00ff00',
    },
  },
  typography: {
    fontFamily: 'Courier New, monospace', // Стиль моноширинного текста
  },
});

// Тема "Эстетика Windows 3.1"
export const win31Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000080', // Темно-синий цвет, характерный для Win 3.1
    },
    secondary: {
      main: '#808080', // Серый цвет
    },
    background: {
      default: '#c0c0c0',
      paper: '#ffffff', // Серо-белая цветовая гамма
    },
    text: {
      primary: '#000000',
      secondary: '#000080',
    },
  },
  typography: {
    fontFamily: 'Tahoma, sans-serif',
  },
});

// Тема "Синтвейв"
export const synthwaveTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff00ff', // Неоново-розовый
    },
    secondary: {
      main: '#00ffff', // Неоново-голубой
    },
    background: {
      default: '#1a1a2e',
      paper: '#0f0f1c', // Темные цвета с неоновыми акцентами
    },
    text: {
      primary: '#ff00ff',
      secondary: '#00ffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Нейтральная тема
export const neutralTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007bff',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
  },
});

// Светлая тема
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
});

// Тёмная тема
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});
