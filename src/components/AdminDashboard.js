// src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalStores, setTotalStores] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const usersResponse = await axios.get('http://localhost:3000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const storesResponse = await axios.get('http://localhost:3000/api/stores', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const ratingsResponse = await axios.get('http://localhost:3000/api/ratings', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(usersResponse.data);
            setStores(storesResponse.data);
            setTotalUsers(usersResponse.data.length);
            setTotalStores(storesResponse.data.length);
            setTotalRatings(ratingsResponse.data.length);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Total Users: {totalUsers}</p>
            <p>Total Stores: {totalStores}</p>
            <p>Total Ratings: {totalRatings}</p>
            <h3>Users List</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email} - {user.role}</li>
                ))}
            </ul>
            <h3>Stores List</h3>
            <ul>
                {stores.map(store => (
                    <li key={store.id}>{store.name} - {store.address} - Rating: {store.rating || 'No ratings yet'}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;