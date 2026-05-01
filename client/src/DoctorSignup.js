import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './form.css';
import Icon from "./LogoIcon.png";

export default function DoctorSignup() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        gmcNumber: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.username || !formData.gmcNumber || !formData.password || !formData.confirmPassword) {
            setErrorMessage("Please fill in all fields");
            setSuccessMessage("");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            setSuccessMessage("");
            return;
        }

        if (!/^\d{7}$/.test(formData.gmcNumber)) {
            setErrorMessage("GMC number must be 7 digits");
            setSuccessMessage("");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/doctor-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    full_name: formData.fullName,
                    username: formData.username,
                    gmc_number: formData.gmcNumber,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.status === 200 || data.status === 201) {
                setSuccessMessage(data.message);
                setErrorMessage("");
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
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </div>
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
                <h1>🩺 Doctor Sign Up</h1>
                <h2>Create your TreatMe doctor account</h2>
                <form className="form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Full name (e.g. Dr. Jane Smith)"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            id="gmcNumber"
                            name="gmcNumber"
                            placeholder="GMC number (7 digits)"
                            value={formData.gmcNumber}
                            onChange={handleChange}
                            maxLength={7}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
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
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}

                    <button type="submit">Create Account</button>

                    <p>Already have an account? <Link to="/doctorlogin">Log in as a Doctor</Link></p>
                    <p>Not a doctor? <Link to="/signup">Sign up as a Patient</Link></p>

                </form>
            </div>
        </div>
    );
}