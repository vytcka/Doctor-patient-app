import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css';
import Icon from "./LogoIcon.png";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password){
            setErrorMessage('Please fill in all fields');
            setSuccessMessage('');
            return;
        }
        else {
            setErrorMessage('');
            setSuccessMessage('Login successful! Redirecting...');
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
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
                <h1>Login</h1>
                <h2>Welcome back! Please login to your account</h2>
                <form className="form" onSubmit={handleSubmit}>
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

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Login</button>

                    <Link to="/request" className="guest">Continue as guest?</Link>
                    <p>Don't have an account yet? <Link to="/signup">Sign up</Link></p>

                </form>
            </div>
        </div>
    )
}