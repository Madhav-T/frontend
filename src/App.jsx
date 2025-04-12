// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import StoreList from './components/StoreList';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import UpdatePassword from './components/UpdatePassword';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role || '');
    }, []);

    const handleLoginSuccess = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole('');
    };

    const PrivateRoute = ({ component: Component, roles, ...rest }) => (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    roles ? (
                        roles.includes(userRole) ? (
                            <Component {...props} />
                        ) : (
                            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                        )
                    ) : (
                        <Component {...props} />
                    )
                ) : (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                )
            }
        />
    );

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
            <div>
                <Switch>
                    <Route exact path="/" render={props => <Login {...props} onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" component={Register} />
                    <PrivateRoute path="/stores" component={StoreList} />
                    <PrivateRoute path="/store-owner-dashboard" component={StoreOwnerDashboard} roles={['normal']} />
                    <PrivateRoute path="/admin-dashboard" component={AdminDashboard} roles={['admin']} />
                    <PrivateRoute path="/update-password" component={UpdatePassword} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;