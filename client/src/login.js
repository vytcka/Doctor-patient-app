import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './form.css';

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
       
        )
}