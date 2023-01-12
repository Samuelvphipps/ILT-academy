import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <LoginForm />
      <div>


      </div>
    </div>
  );
}

export default LoginPage;
