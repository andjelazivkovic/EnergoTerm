import React, { useState, useEffect } from 'react';
import { registerUser } from '../api/energoterm_api.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            navigate('/home');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const data = await registerUser(email, password);
        setMessage("Korisnik sa ovom email adresom je već registrovan!" || data.detail);
        
        if (data.user_data) {
            localStorage.setItem('user_data', JSON.stringify(data.user_data));
            const token = data.user_data.id_token;
            if (token) {
                localStorage.setItem('id_token', token);
            }
            navigate('/login');
        }
    };

    return (
        <div className="container">
            <div className="form-cont">
                <h2 className="title">Registracija</h2>
                <form onSubmit={handleRegister} className="form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        placeholder="Lozinka"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                    />
                    <button type="submit" className="button">Registracija</button>
                </form>
                {message && <p className="message">{message}</p>}
                <p className="link-text">
                    Već imaš nalog? <Link to="/login" className="link">Prijavi se!</Link>
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default RegisterPage;
