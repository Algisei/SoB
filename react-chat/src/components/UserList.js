// components/UserList.js
import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import io from 'socket.io-client';
import UserIdDisplay from './UserIdDisplay';

// Подключение к серверу Socket.IO
const socket = io('http://localhost:3001');

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(''); // Состояние для текущего идентификатора пользователя

  useEffect(() => {
    // Обработка обновления списка пользователей
    socket.on('userListUpdate', (updatedUsers) => {
      setUsers(updatedUsers);

      // Устанавливаем идентификатор для текущего пользователя
      if (updatedUsers.length > 0) {
        const currentUser = updatedUsers[updatedUsers.length - 1]; // Предполагаем, что последний пользователь — это текущий
        setCurrentUserId(currentUser.uniqueId);
      }
    });

    // Очищаем слушатели событий при размонтировании компонента
    return () => {
      socket.off('userListUpdate');
    };
  }, []);

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 1, 
        boxShadow: 2, 
        p: 2, 
        height: '100%', 
        overflow: 'auto' 
      }}
    >
      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
      {/* Отображаем уникальный идентификатор под списком пользователей */}
      <UserIdDisplay uniqueId={currentUserId} />
    </Box>
  );
};

export default UserList;
