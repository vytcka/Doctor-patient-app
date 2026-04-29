import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css'; 
import Icon from "./LogoIcon.png";

export default function Signup() {
    const navigate = useNavigate();
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
        if (!formData.username || !formData.email || !formData.password) {
            setErrorMessage('Please fill in all fields');
            setSuccessMessage('');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            setSuccessMessage('');
            return;
        }
        if (formData.password.length < 6) {
            setErrorMessage('Password must be at least 6 characters');
            setSuccessMessage('');
            return;
        }
        else {
            setErrorMessage('');
            setSuccessMessage('Signup successful! Redirecting to dashboard...');
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        }
    };

    //UI
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </Link>
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
                    <p>Already have an account? <Link to="/login">Login</Link></p>

                </form>
            </div>
        </div>
    );

}