import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './form.css';
import Icon from "./LogoIcon.png";

export default function DoctorLogin() {

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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password){
            setErrorMessage('Please fill in all fields');
            setSuccessMessage('');
            return;
        }
        else {
            setErrorMessage('');
            setSuccessMessage('Login successful!');
        }
    };


    return(
        <div>
            <div className="form-container"> 
                <h1>Doctor Login</h1>
                <h2>Welcome back! Please login to your account</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="username"
                            id="username"
                            name="username"
                            placeholder='username'
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
                    <p>Don't have an account yet? <Link to="/DoctorSignup">Sign up</Link></p>
                </form>
            </div>
        </div>
    )

}