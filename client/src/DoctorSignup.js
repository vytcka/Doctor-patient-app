import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './form.css';
import Icon from "./LogoIcon.png";

const SPECIALTIES = [
    "General Practice", "Cardiology", "Dermatology", "Emergency Medicine",
    "Endocrinology", "Gastroenterology", "Haematology", "Neurology",
    "Obstetrics and Gynaecology", "Oncology", "Ophthalmology", "Orthopaedics",
    "Paediatrics", "Psychiatry", "Radiology", "Respiratory Medicine",
    "Rheumatology", "Surgery", "Urology"
];

export default function DoctorSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', nhsNumber: '', password: '', confirmPassword: '', dateOfBirth: '', location: '', specialty: '', language: '', bio: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.username || !formData.nhsNumber || !formData.password || !formData.confirmPassword || !formData.dateOfBirth || !formData.location || !formData.specialty || !formData.language || !formData.bio) { setErrorMessage("Please fill in all fields"); setSuccessMessage(""); return; }
        if (formData.password !== formData.confirmPassword) { setErrorMessage("Passwords do not match"); setSuccessMessage(""); return; }
        if (!/^\d{10}$/.test(formData.nhsNumber)) { setErrorMessage("NHS number must be 10 digits"); setSuccessMessage(""); return; }
        try {
            const response = await fetch("http://127.0.0.1:5000/doctor/register", {
                method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({ "first name": formData.firstName, "last name": formData.lastName, username: formData.username, password: formData.password, "nhs number": formData.nhsNumber, "date of birth": formData.dateOfBirth, location: formData.location, specialty: formData.specialty, language: formData.language, bio: formData.bio, availability: true })
            });
            const data = await response.json();
            if (data.status === 200 || data.status === 201) {
                setSuccessMessage("Account created! Redirecting to login...");
                setErrorMessage("");
                toast.success("Doctor account created successfully!");
                setTimeout(() => navigate('/doctorlogin'), 1500);
            } else { setErrorMessage(data.message); setSuccessMessage(""); }
        } catch (error) { setErrorMessage("Server connection failed"); setSuccessMessage(""); }
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
                <h1>Doctor Sign Up</h1>
                <h2>Create your TreatMe doctor account</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group"><input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="email" name="username" placeholder="Email (used as username)" value={formData.username} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="text" name="nhsNumber" placeholder="NHS number (10 digits)" value={formData.nhsNumber} onChange={handleChange} maxLength={10} required /></div>
                    <div className="form-group"><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="text" name="location" placeholder="Location (e.g. Manchester, UK)" value={formData.location} onChange={handleChange} required /></div>
                    <div className="form-group">
                        <select name="specialty" value={formData.specialty} onChange={handleChange} required style={{ width: "100%", padding: "10px", margin: "7px", fontSize: "14px", color: "#2F5D96", border: "1px solid #ccc", borderRadius: "8px" }}>
                            <option value="">Select specialty...</option>
                            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><input type="text" name="language" placeholder="Primary language (e.g. English)" value={formData.language} onChange={handleChange} required /></div>
                    <div className="form-group">
                        <textarea name="bio" placeholder="Biography (min 20 characters)" value={formData.bio} onChange={handleChange} required style={{ width: "100%", padding: "10px", margin: "7px", fontSize: "14px", color: "#2F5D96", minHeight: "80px", borderRadius: "8px", border: "1px solid #ccc" }} />
                    </div>
                    <div className="form-group"><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /></div>
                    <div className="form-group"><input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required /></div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Create Account</button>
                    <p>Already have an account? <Link to="/doctorlogin">Log in</Link></p>
                    <p>Not a doctor? <Link to="/signup-choice">Sign up as a Patient</Link></p>
                </form>
            </div>
        </div>
    );
}