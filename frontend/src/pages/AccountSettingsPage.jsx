import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { logoutUser, changeUserPassword } from '../api/energoterm_api.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/RegisterPage.css'; 

const AccountSettingsPage = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Lozinke se ne poklapaju.');
            return;
        }
        
        const uid = JSON.parse(localStorage.getItem('user_data')).uid;
        const response = await changeUserPassword(uid, newPassword);
        setMessage(response.message || response.error || 'Promena lozinke nije uspela.');
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user_data'));
        if (userData) {
            setEmail(userData.email);
        }
    }, []);

    return (
        <div className="container"> 
            <Navbar />
            <div className="form-cont"> 
                <h2 className="title">🔧 PODEŠAVANJA PROFILA</h2>
                <p>Email: {email}</p>
                <p className="password-suggestion">
                ⚙️ PROMENA LOZINKE
                </p>
                <form onSubmit={handleChangePassword} className="form">
                    <input
                        type="password"
                        placeholder="Nova lozinka"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input" 
                    />
                    <input
                        type="password"
                        placeholder="Ponovite lozinku"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input" 
                    />
                    <button type="submit" className="button green-button">Promeni lozinku</button> 
                </form>
                {message && <p className="message">{message}</p>} 
            </div>
            <Footer />
        </div>
    );
};

export default AccountSettingsPage;
