// src/components/Navbar.js
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css'; // You might have a CSS file for the navbar

const Navbar = ({ isLoggedIn, userRole, onLogout }) => {
    const history = useHistory();

    const handleLogout = () => {
        onLogout();
        history.push('/'); // Redirect to the login page after logout
    };

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                {isLoggedIn && (
                    <>
                        <li><Link to="/stores">Stores</Link></li>
                        <li><Link to="/update-password">Update Password</Link></li>
                        {userRole === 'admin' && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
                        {userRole === 'normal' && <li><Link to="/store-owner-dashboard">Owner Dashboard</Link></li>}
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <li><Link to="/">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
