import React, { useEffect, useRef } from 'react';
import { List, ListItem, Box, Typography, useTheme } from '@mui/material';

function MessageList({ messages }) {
  const theme = useTheme();
  const bottomRef = useRef(null); // Создаем реф для последнего элемента

  // Автопрокрутка при обновлении сообщений
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <List sx={{ maxHeight: '60vh', overflowY: 'auto', mb: 2 }}>
      {messages.map((message) => (
        <ListItem key={message.id} sx={{ display: 'flex', justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start' }}>
          <Box
            sx={{
              bgcolor: message.sender === 'You' ? theme.palette.primary.main : theme.palette.background.default,
              color: message.sender === 'You' ? theme.palette.primary.contrastText : theme.palette.text.primary,
              p: 2,
              borderRadius: 2,
              maxWidth: '75%',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {message.sender}
            </Typography>
            <Typography variant="body1">
              {message.text}
            </Typography>
          </Box>
        </ListItem>
      ))}
      {/* Элемент для автопрокрутки */}
      <div ref={bottomRef} />
    </List>
  );
}

export default MessageList;
