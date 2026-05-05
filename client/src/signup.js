import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css';
import Icon from "./LogoIcon.png";

export default function Signup({ setIsLoggedIn, setUserRole }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        location: '',
        bio: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password || !formData.confirmPassword ||
            !formData.firstName || !formData.lastName || !formData.dateOfBirth ||
            !formData.location || !formData.bio) {
            setErrorMessage('Please fill in all fields');
            setSuccessMessage('');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    "first name": formData.firstName,
                    "last name": formData.lastName,
                    "date of birth": formData.dateOfBirth,
                    location: formData.location,
                    bio: formData.bio
                })
            });

            const data = await response.json();

            if (data.success === true) {
                setIsLoggedIn(true);
                setUserRole('user');
                setSuccessMessage('Account created! Redirecting...');
                setErrorMessage('');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setErrorMessage(data.message || 'Signup failed. Please try again.');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage("Server connection failed");
            setSuccessMessage('');
        }
    };

    return (
        <div>
            {/* Navbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/post-request" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                    </Link>
                    <Link to="/search" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button>
                    </Link>
                </div>
            </div>

            <div className="form-container">
                <h1>Sign Up</h1>
                <h2>Create your TreatMe account</h2>
                <form className="form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <input type="text" name="firstName" placeholder="First name"
                            value={formData.firstName} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input type="text" name="lastName" placeholder="Last name"
                            value={formData.lastName} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input type="email" name="username" placeholder="Email (used as username)"
                            value={formData.username} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input type="date" name="dateOfBirth"
                            value={formData.dateOfBirth} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input type="text" name="location" placeholder="Location (e.g. Newcastle, UK)"
                            value={formData.location} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <textarea name="bio" placeholder="Short bio (min 20 characters)"
                            value={formData.bio} onChange={handleChange} required
                            style={{ 
                                width: "100%", 
                                padding: "10px",
                                margin: "7px",
                                fontSize: "14px", 
                                color: "#2F5D96",
                                borderRadius: "0",
                                border: "1px solid #ccc",
                                boxSizing: "border-box"
                            }} />
                    </div>

                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password"
                            value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input type="password" name="confirmPassword" placeholder="Confirm password"
                            value={formData.confirmPassword} onChange={handleChange} required />
                    </div>

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}

                    <button type="submit">Create Account</button>

                    <Link to="/post-request" className="guest">Continue as guest?</Link>
                    <p>Already have an account? <Link to="/login">Login</Link></p>

                </form>
            </div>
        </div>
    );
}