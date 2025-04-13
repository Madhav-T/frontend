// src/components/StoreList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StoreList.css';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingToModify, setRatingToModify] = useState(null);
    const [newRatingValue, setNewRatingValue] = useState('');
    const ws = new WebSocket('ws://localhost:3000'); // Replace with your WebSocket server URL

    useEffect(() => {
        const fetchStores = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3000/api/stores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStores(response.data);
            } catch (error) {
                console.error("Error fetching stores:", error);
                // Handle error appropriately
            }
        };

        fetchStores();

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'newRating' || data.type === 'updatedRating') {
                    setStores(prevStores => {
                        return prevStores.map(store => {
                            if (store.id === data.storeId) {
                                return {
                                    ...store,
                                    rating: data.averageRating,
                                    userRating: (JSON.parse(localStorage.getItem('user'))?.id === data.userId) ? data.rating : store.userRating,
                                };
                            }
                            return store;
                        });
                    });
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };

        ws.onopen = () => {
            console.log("WebSocket connection opened");
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.close(); // Clean up WebSocket connection on unmount
        };
    }, []);

    const fetchStores = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:3000/api/stores', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStores(response.data);
        } catch (error) {
            console.error("Error fetching stores:", error);
            // Handle error appropriately
        }
    };

    const handleRatingSubmit = async (storeId, rating) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:3000/api/rate`,
                { storeId, rating }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            alert(`You rated store ${storeId} with ${rating} stars!`);
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating.");
        }
    };

    const handleModifyRatingClick = (storeId) => {
        setRatingToModify(storeId);
        setNewRatingValue(stores.find(store => store.id === storeId)?.userRating || '');
    };

    const handleNewRatingChange = (e) => {
        setNewRatingValue(e.target.value);
    };

    const handleUpdateRating = async (storeId) => {
        const token = localStorage.getItem('token');
        const rating = parseInt(newRatingValue);
        if (rating >= 1 && rating <= 5) {
            try {
                await axios.put(`http://localhost:3000/api/rate/update`,
                    { storeId, newRating: rating }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                setRatingToModify(null);
                alert(`Your rating for store ${storeId} has been updated to ${rating} stars!`);
            } catch (error) {
                console.error("Error updating rating:", error.response?.data || error.message);
                alert("Failed to update rating.");
            }
        } else {
            alert("Please enter a rating between 1 and 5.");
        }
    };

    return (
        <div className="store-list-container">
            <h2>Store List</h2>
            <input
                className="store-search-input"
                type="text"
                placeholder="Search by name or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="store-list">
                {stores.filter(store => store.name.toLowerCase().includes(searchTerm.toLowerCase()) || store.address.toLowerCase().includes(searchTerm.toLowerCase())).map(store => (
                    <li key={store.id} className="store-item">
                        <h3>{store.name}</h3>
                        <p>{store.address}</p>
                        <p>Overall Rating: {store.rating || 'No ratings yet'}</p>
                        <p>Your Rating: {store.userRating || 'Not rated yet'}</p>
                        {!store.userRating ? (
                            <div className="rating-buttons">
                                <button onClick={() => handleRatingSubmit(store.id, 5)}>Rate 5</button>
                                <button onClick={() => handleRatingSubmit(store.id, 4)}>Rate 4</button>
                                <button onClick={() => handleRatingSubmit(store.id, 3)}>Rate 3</button>
                                <button onClick={() => handleRatingSubmit(store.id, 2)}>Rate 2</button>
                                <button onClick={() => handleRatingSubmit(store.id, 1)}>Rate 1</button>
                            </div>
                        ) : (
                            <div className="modify-buttons">
                                <button onClick={() => handleModifyRatingClick(store.id)}>Modify Rating</button>
                                {ratingToModify === store.id && (
                                    <div>
                                        <input
                                            className="modify-rating-input"
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={newRatingValue}
                                            onChange={handleNewRatingChange}
                                        />
                                        <button onClick={() => handleUpdateRating(store.id)}>Update</button>
                                        <button onClick={() => setRatingToModify(null)}>Cancel</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StoreList;
