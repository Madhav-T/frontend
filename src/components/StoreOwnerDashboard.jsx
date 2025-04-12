// src/components/StoreOwnerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StoreOwnerDashboard.css';

const StoreOwnerDashboard = () => {
    const [ownedStoresData, setOwnedStoresData] = useState([]);
    const [error, setError] = useState('');
    const ws = new WebSocket('ws://localhost:3000'); // Replace with your WebSocket server URL

    useEffect(() => {
        const fetchOwnerDashboardData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3000/api/owner/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOwnedStoresData(response.data);
            } catch (error) {
                setError(error.response?.data || 'Failed to fetch dashboard data.');
                console.error("Error fetching owner dashboard data:", error);
            }
        };

        fetchOwnerDashboardData();

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'newRating' || data.type === 'updatedRating') {
                    setOwnedStoresData(prevData => {
                        return prevData.map(storeData => {
                            if (storeData.storeId === data.storeId) {
                                const updatedRatings = storeData.ratings.filter(rating => rating.user_id !== data.userId); // Remove previous rating by the same user
                                updatedRatings.push({ rating: data.rating, userName: data.userName, user_id: data.userId }); // Add the new/updated rating
                                const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0);
                                const averageRating = updatedRatings.length > 0 ? (totalRating / updatedRatings.length).toFixed(2) : '0.00';
                                return { ...storeData, averageRating, ratings: updatedRatings };
                            }
                            return storeData;
                        });
                    });
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };

        ws.onopen = () => {
            console.log("WebSocket connection opened from Owner Dashboard");
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed from Owner Dashboard");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error from Owner Dashboard:", error);
        };

        return () => {
            ws.close(); // Clean up WebSocket connection on unmount
        };
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="store-owner-dashboard">
            <h2>Store Owner Dashboard</h2>
            {ownedStoresData.length > 0 ? (
                ownedStoresData.map(storeData => (
                    <div key={storeData.storeId} className="store-info">
                        <h3>{storeData.storeName}</h3>
                        <p>Average Rating: {storeData.averageRating}</p>
                        <h4>Ratings Received:</h4>
                        {storeData.ratings.length > 0 ? (
                            <ul>
                                {storeData.ratings.map((rating, index) => (
                                    <li key={index}>
                                        User: {rating.userName} - Rating: {rating.rating}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No ratings received yet for this store.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No stores owned by you.</p>
            )}
        </div>
    );
};

export default StoreOwnerDashboard;