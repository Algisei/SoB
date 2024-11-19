import React, { useState } from 'react';
import { Box, Button, TextField, useTheme } from '@mui/material';

function MessageForm({ addMessage }) {
  const theme = useTheme();  // Получаем текущую тему
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            bgcolor: theme.palette.background.paper, // Фон поля ввода
            color: theme.palette.text.primary,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            bgcolor: theme.palette.primary.main,  // Кнопка отправки в стиле темы
            color: theme.palette.primary.contrastText,
          }}
        >
          Send
        </Button>
      </Box>
    </form>
  );
}

export default MessageForm;
