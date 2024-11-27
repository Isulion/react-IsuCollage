import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  styled
} from '@mui/material';
import { LoginProps } from '../types';

const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  margin: '40px auto',
  backgroundColor: '#f5f5f5'
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <LoginCard>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Login to Collage Creator
        </Typography>
        
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Login
          </Button>
        </Form>
      </CardContent>
    </LoginCard>
  );
};
