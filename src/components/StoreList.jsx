// src/StoreList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStores = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/stores', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStores(response.data);
        };
        fetchStores();
    }, []);

    const handleRatingSubmit = async (storeId, rating) => {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:3000/api/rate`,
            { storeId, rating }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optionally refresh the store list or update the state accordingly
            alert(`You rated store ${storeId} with ${rating} stars!`);
        };
    
        return (
            <div>
                <h2>Store List</h2>
                <input
                    type="text"
                    placeholder="Search by name or address"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul>
                    {stores.filter(store => store.name.includes(searchTerm) || store.address.includes(searchTerm)).map(store => (
                        <li key={store.id}>
                            <h3>{store.name}</h3>
                            <p>{store.address}</p>
                            <p>Overall Rating: {store.rating || 'No ratings yet'}</p>
                            <button onClick={() => handleRatingSubmit(store.id, 5)}>Rate 5</button>
                            <button onClick={() => handleRatingSubmit(store.id, 4)}>Rate 4</button>
                            <button onClick={() => handleRatingSubmit(store.id, 3)}>Rate 3</button>
                            <button onClick={() => handleRatingSubmit(store.id, 2)}>Rate 2</button>
                            <button onClick={() => handleRatingSubmit(store.id, 1)}>Rate 1</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    
    export default StoreList;