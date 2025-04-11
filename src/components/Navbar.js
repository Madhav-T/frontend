// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/stores">Store List</Link></li>
                <li><Link to="/store-owner-dashboard">Store Owner Dashboard</Link></li>
                <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;