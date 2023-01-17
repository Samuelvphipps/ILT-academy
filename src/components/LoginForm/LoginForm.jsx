import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import { ThemeProvider } from '@mui/material';
import { PrimaryMainTheme } from '../PrimaryMainTheme/PrimaryMainTheme';
import { Button } from '@mui/material';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(store => store.errors);
    const dispatch = useDispatch();
    const history = useHistory();

    const login = (event) => {
        event.preventDefault();

        if (username && password) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    username: username,
                    password: password,
                },
            });
        } else {
            dispatch({ type: 'LOGIN_INPUT_ERROR' });
        }
    }; // end login

    return (
        <ThemeProvider theme={PrimaryMainTheme}>
            <form className="formPanel" onSubmit={login}>
                
                <h2>Login</h2>
                <div>
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={() => {
                            setUsername('studentdemo');
                            setPassword('studentdemo')
                        }}
                        sx={{ marginBottom: '15px', marginTop: '15px' }}
                    >
                        Use demo student info
                    </Button>
                </div>
                <div>
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={() => { setUsername('admin'); setPassword('admin') }}
                        sx={{ marginBottom: '15px', marginTop: '15px' }}
                    >
                        Use demo admin info
                    </Button>
                </div>
                <div>
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={() => { history.push('/registration')}}
                        sx={{ marginBottom: '15px', marginTop: '15px' }}
                    >
                        Create new student and go through orientation feature!
                    </Button>
                </div>
                {errors.loginMessage && (
                    <h3 className="alert" role="alert">
                        {errors.loginMessage}
                    </h3>
                )}
                <div>
                    <label htmlFor="username">
                        Username:
                        <input
                            type="text"
                            name="username"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="password">
                        Password:
                        <input
                            type="password"
                            name="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <Button type='submit' variant='contained' sx={{ marginBottom: '15px', marginTop: '15px' }}>Log In</Button>
                </div>
                
                

            </form>
        </ThemeProvider>
    );
}

export default LoginForm;
