import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css';
import Icon from "./LogoIcon.png";

export default function DoctorLogin({ setIsLoggedIn, setUserRole }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setErrorMessage("Please fill in all fields");
            setSuccessMessage("");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/doctor/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.status === 200) {
                setSuccessMessage(data.message);
                setErrorMessage("");
                // Redirect to doctor dashboard after 1 second
                setTimeout(() => {
                    navigate('/doctor-dashboard');
                }, 1000);
            } else {
                setErrorMessage(data.message);
                setSuccessMessage("");
            }

        } catch (error) {
            setErrorMessage("Server connection failed");
            setSuccessMessage("");
        }
    };

    return (
        <div>
            {/* Header with clickable logo */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                    {/* Home button REMOVED - logo handles it */}
                    <Link to="/post-request" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                    </Link>
                    <Link to="/reviews" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
                    </Link>
                    <Link to="/login-choice" style={{ textDecoration: "none" }}>
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
                <h1>Doctor Login</h1>
                <h2>Welcome back, Doctor! Please login to your account</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Login</button>

                    <p>Not a doctor? <Link to="/login">Log in as a Patient</Link></p>
                    <p>Don't have an account yet? <Link to="/signup">Sign up</Link></p>
                </form>
            </div>
        </div>
    );
}