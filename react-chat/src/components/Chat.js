import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const socket = io('http://localhost:3001');

function Chat() {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const addMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'You',
    };
    setMessages([...messages, newMessage]);
    socket.emit('message', newMessage);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 2,
        p: 3,
        boxShadow: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Chat Room
      </Typography>
      <MessageList messages={messages} />
      <MessageForm addMessage={addMessage} />
    </Box>
  );
}

export default Chat;
