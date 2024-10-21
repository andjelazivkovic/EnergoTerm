import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { loginUser } from '../api/energoterm_api.jsx'; 
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/RegisterPage.css'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const user = localStorage.getItem('user_data');
        if (user) {
            navigate('/home'); 
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await loginUser(email, password);
        console.log('Login response:', data);
        setMessage(data.message || data.detail || 'Login failed.');

        if (data.user_data) { 
            const token = data.user_data.id_token; 
            if (token) { 
                localStorage.setItem('id_token', token);
            }
            localStorage.setItem('user_data', JSON.stringify(data.user_data));
            navigate('/home');
        }
    };

    return (
        <div className="container"> 
            <div className="form-cont"> 
                <h2 className="title">Prijava</h2> 
                <form onSubmit={handleLogin} className="form">
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
                    <button type="submit" className="button">Prijavi se</button> 
                </form>
                {message && <p className="message">{message}</p>} 
                <p className="link-text">
                    Još uvek nemaš nalog? <Link to="/register" className="link">Registruj se!</Link>
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
