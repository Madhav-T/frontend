// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, password });
            const { token, role } = response.data;
            onLoginSuccess(token, role);
            localStorage.setItem('user', JSON.stringify({ email: response.data.email, id: response.data.userId }));
            if (role === 'admin') {
                history.push('/admin-dashboard');
            } else {
                history.push('/stores');
            }
        } catch (error) {
            setError(error.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
            <p><Link to="/update-password">Update Password</Link></p>
        </div>
    );
};

export default Login;
