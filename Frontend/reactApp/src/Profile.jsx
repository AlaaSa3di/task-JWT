import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
                setMessage(response.data.message);
            } catch (error) {
                setMessage('You are not authenticated');
                navigate('/'); 
            }
        };
        fetchProfile();
    }, [navigate]);

    return (
        <div>
            <h1>Profile Page</h1>
            <p>{message}</p>
        </div>
    );
};

export default Profile;