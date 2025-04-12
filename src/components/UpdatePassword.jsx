// src/components/UpdatePassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './UpdatePassword.css';

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/api/user/password',
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data);
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => history.push('/stores'), 2000); // Redirect after 2 seconds
        } catch (error) {
            setError(error.response?.data || 'Failed to update password.');
        }
    };

    return (
        <div className="update-password-container">
            <h2>Update Password</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Old Password:</label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="update-button">Update Password</button>
            </form>
        </div>
    );
};

export default UpdatePassword;