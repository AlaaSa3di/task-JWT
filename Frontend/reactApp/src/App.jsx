import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import './App.css'; 

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
                if (response.data.message) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isLogin ? '/signin' : '/signup';
        try {
            const response = await axios.post(`http://localhost:5000${endpoint}`, { username, password }, { withCredentials: true });
            alert(response.data.message);
            setIsAuthenticated(true);
            navigate('/home');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
            setIsAuthenticated(false);
            navigate('/');
        } catch (error) {
            alert('Failed to logout');
        }
    };

    return (
        <div className="container">
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/home" />
                        ) : (
                            <div>
                                <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
                                </form>
                                <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? 'Need to Sign Up?' : 'Already have an account?'}
                                </button>
                            </div>
                        )
                    }
                />
                <Route
                    path="/home"
                    element={
                        isAuthenticated ? (
                            <Home />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isAuthenticated ? (
                            <div className="profile-container">
                                <h1>Profile</h1>
                                <Profile />
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </div>
    );
};

export default App;