import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Chat from './components/Chat';
//import AppDrawer from './components/AppDrawer';
import ThemeSelector from './components/ThemeSelector';
import { retroTheme, win31Theme, synthwaveTheme, neutralTheme, lightTheme, darkTheme } from './themes';

function App() {
  const [currentTheme, setCurrentTheme] = useState('neutral'); // По умолчанию нейтральная тема
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Отслеживаем состояние панели
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Состояние для редактирования заголовка
  const [chatTitle, setChatTitle] = useState('React Chat'); // Текущее название чата
  const [newChatTitle, setNewChatTitle] = useState(chatTitle); // Состояние для ввода нового заголовка

  const drawerWidth = 240; // Ширина боковой панели

  const themeMap = {
    retro: retroTheme,
    win31: win31Theme,
    synthwave: synthwaveTheme,
    neutral: neutralTheme,
    light: lightTheme,
    dark: darkTheme,
  };

  // Открытие меню настроек
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Открытие/закрытие боковой панели
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Активация редактирования заголовка
  const handleEditTitle = () => {
    setIsEditingTitle(true); // Включаем режим редактирования
  };

  // Обновление нового заголовка по мере ввода текста
  const handleTitleChange = (e) => {
    setNewChatTitle(e.target.value); // Обновляем состояние для нового заголовка
  };

  // Сохранение нового заголовка при нажатии Enter
  const handleTitleSubmit = () => {
    if (newChatTitle.trim() !== '') { // Проверяем, что введённый текст не пустой
      setChatTitle(newChatTitle); // Сохраняем новый заголовок
    }
    setIsEditingTitle(false); // Завершаем режим редактирования
  };

  // Обработка нажатия клавиши Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit(); // Сохраняем новое название при нажатии Enter
    }
  };

  return (
    <ThemeProvider theme={themeMap[currentTheme]}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Верхняя панель */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>

            {/* Если в режиме редактирования, отображаем поле ввода, иначе текст */}
            {isEditingTitle ? (
              <TextField
                value={newChatTitle}
                onChange={handleTitleChange}
                onKeyPress={handleKeyPress}
                autoFocus // Автоматический фокус на поле ввода
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              />
            ) : (
              <Typography variant="h6" sx={{ flexGrow: 1 }} onClick={handleEditTitle}>
                {chatTitle}
              </Typography>
            )}

            {/* Иконка настроек */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <SettingsIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {/* Выбор темы */}
              <MenuItem onClick={handleMenuClose}>
                <ThemeSelector currentTheme={currentTheme} setTheme={setCurrentTheme} />
              </MenuItem>

              {/* Пункт для изменения названия чата */}
              <MenuItem onClick={handleEditTitle}>Изменить название чата</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Боковая панель со списком пользователей */}
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : 0,
            flexShrink: 0,
            transition: 'width 0.3s',
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              transition: 'width 0.3s',
            },
          }}
        >
          <Box sx={{ width: drawerWidth, mt: 8 }}>
            <Typography variant="h6" sx={{ p: 2 }}>Users</Typography>
            <List>
              {['User1', 'User2', 'User3'].map((user, index) => (
                <ListItem button key={index}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Область чата */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: (theme) => theme.palette.background.default,
            p: 3,
            mt: 8,
            width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%', // Изменение ширины при открытии/закрытии панели
            transition: 'width 0.3s',
          }}
        >
          <Chat />
        </Box>
        {/* {/*Область для иконок приложений
        <AppDrawer /> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
