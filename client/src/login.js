import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './form.css';
import Icon from "./LogoIcon.png";

export default function Login() {
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
            setSuccessMessage('Login successful!');
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
                    <p>Don't have an account yet? <Link to="/Signup">Sign up</Link></p>

                </form>
            
            </div>
        </div>
       
        )
}