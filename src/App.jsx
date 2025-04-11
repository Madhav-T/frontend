// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import StoreList from './StoreList';
import StoreOwnerDashboard from './StoreOwnerDashboard';
import AdminDashboard from './AdminDashboard';

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