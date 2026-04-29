import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './form.css'; 
import Icon from "./LogoIcon.png";

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    //validation and submit form data to backend
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        else {
            setErrorMessage('');
            setSuccessMessage('Signup successful!');
        }
    };

    //UI
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>{/* App title */}
                </div>
                {/* Buttons for: Home, PostaRequest, Reviews, Login and their colours + placements */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Home</button>
                    </Link>
                    <Link to="/post-request" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                    </Link>
                    <Link to="/reviews" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
                    </Link>
                    <Link to="/signup" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
                    </Link>
                    <Link to="/chat" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
                    </Link>
                </div>
            </div>
            <div className="form-container">
                <h1>Sign Up</h1>
                <h2>Please create an account</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder='username'
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder='confirm password'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Submit</button>

                    <Link to="/request" className="guest">Continue as guest?</Link>
                    <p>Already have an account? <Link to="/Login">Login</Link></p>

                </form>
            </div>
        </div>
    );

}
