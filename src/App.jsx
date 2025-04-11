// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import StoreList from './components/StoreList';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/stores" component={StoreList} />
                    <Route path="/store-owner-dashboard" component={StoreOwnerDashboard} />
                    <Route path="/admin-dashboard" component={AdminDashboard} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;