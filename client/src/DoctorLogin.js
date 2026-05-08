import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './form.css';
import Icon from "./LogoIcon.png";

export default function DoctorLogin({ setIsLoggedIn, setUserRole, setUserData, setUsername }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) { setErrorMessage("Please fill in all fields"); setSuccessMessage(""); return; }
        try {
            const response = await fetch("http://127.0.0.1:5000/doctor/login", {
                method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({ username: formData.username, password: formData.password })
            });
            const data = await response.json();

        if (data.status === 200) {
            setIsLoggedIn(true);
            setUserRole('doctor');
            setUserData(data.user);        // ← add this
            setUsername(data.user.username); // ← add this

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'doctor');
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('userData', JSON.stringify(data.user));

            setSuccessMessage(data.message);
            setErrorMessage("");
            toast.success("Doctor login successful!");
            setTimeout(() => navigate('/doctor-dashboard'), 1000);

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
                    <Link to="/signup-choice" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>Sign Up</button>
                    </Link>
                </div>
            </div>

            <div className="form-container">
                <h1>Doctor Login</h1>
                <h2>Welcome back, Doctor! Please login to your account</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group"><input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /></div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Login</button>
                    <p>Don't have an account yet? <Link to="/doctorsignup">Sign up</Link></p>
                    <p>Not a doctor? <Link to="/login-choice">Log in as a Patient</Link></p>
                </form>
            </div>
        </div>
    );
}