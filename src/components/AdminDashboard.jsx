// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalStores, setTotalStores] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);
    const [expandedUserId, setExpandedUserId] = useState(null);

    const [userFilters, setUserFilters] = useState({
        name: '',
        email: '',
        address: '',
        role: '',
    });

    const [storeFilters, setStoreFilters] = useState({
        name: '',
        email: '',
        address: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const usersResponse = await axios.get('http://localhost:3000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Users Response Data:", usersResponse.data); // LOG USERS DATA

                const storesResponse = await axios.get('http://localhost:3000/api/stores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Stores Response Data:", storesResponse.data); // LOG STORES DATA

                const ratingsResponse = await axios.get('http://localhost:3000/api/ratings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Ratings Response Data:", ratingsResponse.data); // LOG RATINGS DATA

                setUsers(usersResponse.data);
                setStores(storesResponse.data);
                setTotalUsers(usersResponse.data.length);
                setTotalStores(storesResponse.data.length);
                setTotalRatings(ratingsResponse.data.length);

                console.log("Users State:", users); // LOG USERS STATE AFTER SETTING
                console.log("Stores State:", stores); // LOG STORES STATE AFTER SETTING
                console.log("Total Users State:", totalUsers); // LOG TOTAL USERS STATE
                console.log("Total Stores State:", totalStores); // LOG TOTAL STORES STATE
                console.log("Total Ratings State:", totalRatings); // LOG TOTAL RATINGS STATE

            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error appropriately (e.g., display an error message)
            }
        };
        fetchData();
    }, []);

    const handleAddUserClick = () => {
        setShowAddUser(true);
        setShowAddStore(false);
    };

    const handleAddStoreClick = () => {
        setShowAddStore(true);
        setShowAddUser(false);
    };

    const handleCloseAddForms = () => {
        setShowAddUser(false);
        setShowAddStore(false);
    };

    const handleUserFilterChange = (e) => {
        const { name, value } = e.target;
        setUserFilters({ ...userFilters, [name]: value });
    };

    const handleStoreFilterChange = (e) => {
        const { name, value } = e.target;
        setStoreFilters({ ...storeFilters, [name]: value });
    };

    const toggleUserDetails = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const filteredUsers = users.filter(user => {
        return (
            (user.name?.toLowerCase() || '').includes(userFilters.name.toLowerCase()) &&
            (user.email?.toLowerCase() || '').includes(userFilters.email.toLowerCase()) &&
            (user.address?.toLowerCase() || '').includes(userFilters.address.toLowerCase()) &&
            (user.role?.toLowerCase() || '').includes(userFilters.role.toLowerCase())
        );
    });
    console.log("Filtered Users:", filteredUsers); // LOG FILTERED USERS

    const filteredStores = stores.filter(store => {
        return (
            store.name.toLowerCase().includes(storeFilters.name.toLowerCase()) &&
            (store.email || '').toLowerCase().includes(storeFilters.email.toLowerCase()) &&
            store.address.toLowerCase().includes(storeFilters.address.toLowerCase())
        );
    });
    console.log("Filtered Stores:", filteredStores); // LOG FILTERED STORES

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Total Users: {totalUsers}</p>
            <p>Total Stores: {totalStores}</p>
            <p>Total Ratings: {totalRatings}</p>

            <div>
                <button onClick={handleAddUserClick}>Add New User</button>
                <button onClick={handleAddStoreClick}>Add New Store</button>
            </div>

            {showAddUser && <AddUserForm onClose={handleCloseAddForms} />}
            {showAddStore && <AddStoreForm onClose={handleCloseAddForms} />}

            <h3>Users List</h3>
            <div className="filters">
                <input type="text" placeholder="Filter by Name" name="name" value={userFilters.name} onChange={handleUserFilterChange} />
                <input type="text" placeholder="Filter by Email" name="email" value={userFilters.email} onChange={handleUserFilterChange} />
                <input type="text" placeholder="Filter by Address" name="address" value={userFilters.address} onChange={handleUserFilterChange} />
                <input type="text" placeholder="Filter by Role" name="role" value={userFilters.role} onChange={handleUserFilterChange} />
            </div>
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id} onClick={() => toggleUserDetails(user.id)} className={expandedUserId === user.id ? 'expanded' : ''}>
                        {user.name} - {user.email} - Role: {user.role}
                        {expandedUserId === user.id && (
                            <div className="user-details">
                                <p>Address: {user.address}</p>
                                {/* We'll add the store owner rating here later */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <h3>Stores List</h3>
            <div className="filters">
                <input type="text" placeholder="Filter by Name" name="name" value={storeFilters.name} onChange={handleStoreFilterChange} />
                <input type="text" placeholder="Filter by Email" name="email" value={storeFilters.email} onChange={handleStoreFilterChange} />
                <input type="text" placeholder="Filter by Address" name="address" value={storeFilters.address} onChange={handleStoreFilterChange} />
            </div>
            <ul>
                {filteredStores.map(store => (
                    <li key={store.id}>{store.name} - {store.address} - Email: {store.email || 'N/A'} - Rating: {store.rating || 'No ratings yet'}</li>
                ))}
            </ul>
        </div>
    );
};

const AddUserForm = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('normal'); // Default to normal user
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/api/register', { name, email, password, address, role }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.error("Error adding user:", error.response ? error.response.data : error.message);
            setErrorMessage(error.response ? error.response.data.message : 'Failed to add user.');
        }
    };

    return (
        <div className="add-form">
            <h3>Add New User</h3>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="normal">Normal User</option>
                        <option value="admin">Admin User</option>
                    </select>
                </div>
                <button type="submit">Add User</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

const AddStoreForm = ({ onClose }) => {
    const [ownerId, setOwnerId] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/api/stores', { ownerId, name, address, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.error("Error adding store:", error.response ? error.response.data : error.message);
            setErrorMessage(error.response ? error.response.data.message : 'Failed to add store.');
        }
    };

    return (
        <div className="add-form">
            <h3>Add New Store</h3>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="ownerId">Owner ID:</label>
                    <input type="number" id="ownerId" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email (optional):</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <button type="submit">Add Store</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default AdminDashboard;