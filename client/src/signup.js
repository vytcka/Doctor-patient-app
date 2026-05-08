import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './form.css';
import Icon from "./LogoIcon.png";

export default function Signup({ setIsLoggedIn, setUserRole, setUserData, setUsername }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', firstName: '', lastName: '', dateOfBirth: '', location: '', bio: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [errorList, setErrorList] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorList([]); setErrorMessage('');
        if (!formData.username || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.location || !formData.bio) { setErrorMessage('Please fill in all fields'); return; }
        if (formData.password !== formData.confirmPassword) { setErrorMessage('Passwords do not match'); return; }
        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({ username: formData.username, password: formData.password, "first name": formData.firstName, "last name": formData.lastName, "date of birth": formData.dateOfBirth, location: formData.location, bio: formData.bio })
            });
            const data = await response.json();
            if (data.success === true) {
                setIsLoggedIn(true);
                setUserRole('user');
                setUserData(data.user);          
                setUsername(data.user.username); 

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userData', JSON.stringify(data.user));

                setSuccessMessage('Account created! Redirecting...');
                toast.success("Account created successfully!");
                setTimeout(() => navigate('/dashboard'), 100);
            }
                else if (data.errors && data.errors.length > 0) {
                setErrorList(data.errors);
            } else { setErrorMessage(data.message || 'Signup failed. Please try again.'); }
        } catch (error) { setErrorMessage("Server connection failed"); }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", backgroundColor: "#f0f4ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "68px", backgroundColor: "white", borderBottom: "1px solid #e8edf5", boxShadow: "0 1px 8px rgba(27,75,182,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
                    <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
                    <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800", letterSpacing: "-0.3px" }}>TreatMe</span>
                </Link>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Link to="/search" style={{ textDecoration: "none" }}>
                        <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Find a Doctor</button>
                    </Link>
                    <Link to="/login-choice" style={{ textDecoration: "none" }}>
                        <button style={{ border: "1.5px solid #c7d9f5", background: "white", color: "#1b4cb6", borderRadius: "50px", padding: "9px 20px", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer" }}>Log In</button>
                    </Link>
                </div>
            </div>

            <div className="form-container">
                <h1>Sign Up</h1>
                <h2>Create your TreatMe account</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group"><input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="email" name="username" placeholder="Email (used as username)" value={formData.username} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="text" name="location" placeholder="Location (e.g. Newcastle, UK)" value={formData.location} onChange={handleChange} required /></div>
                    <div className="form-group">
                        <textarea name="bio" placeholder="Short bio (min 20 characters)" value={formData.bio} onChange={handleChange} required style={{ width: "100%", padding: "10px", margin: "7px", fontSize: "14px", color: "#2F5D96", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                    </div>
                    <div className="form-group"><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required /></div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {errorList.length > 0 && <ul style={{ color: "red", textAlign: "left", paddingLeft: "20px" }}>{errorList.map((err, i) => <li key={i}>{err}</li>)}</ul>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Create Account</button>
                    <Link to="/post-request" className="guest">Continue as guest?</Link>
                    <p>Already have an account? <Link to="/login-choice">Login</Link></p>
                </form>
            </div>
        </div>
    );
}