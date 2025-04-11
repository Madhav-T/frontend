// src/StoreOwnerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreOwnerDashboard = () => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const storeId = 1; // Replace with the actual store ID of the logged-in store owner

    useEffect(() => {
        const fetchRatings = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/store/${storeId}/ratings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRatings(response.data.ratings);
            setAverageRating(response.data.averageRating);
        };
        fetchRatings();
    }, [storeId]);

    return (
        <div>
            <h2>Your Store Ratings</h2>
            <p>Average Rating: {averageRating}</p>
            <ul>
                {ratings.map(rating => (
                    <li key={rating.id}>
                        User ID: {rating.user_id}, Rating: {rating.rating}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StoreOwnerDashboard;