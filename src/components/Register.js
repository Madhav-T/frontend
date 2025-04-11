// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', { name, email, password, address });
            alert("Registration successful! You can now log in.");
        } catch (error) {
            alert("Error during registration. Please try again.");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <Button type="submit" variant="contained">Register</Button>
        </form>
    );
};

export default Register;