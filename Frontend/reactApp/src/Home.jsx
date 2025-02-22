import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate('/profile'); 
    };

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={goToProfile}>Go to Profile</button>
        </div>
    );
};

export default Home;