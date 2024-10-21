import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import logo from '../logo/logo1.png';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user_data');
        localStorage.removeItem('id_token');
        navigate('/login');
    };

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#3e3e40' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <img src={logo} alt="EnergoTerm logo" style={{ height: '40px', marginRight:'-25px', fontSize:'14px' }} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px', color: '#c79e16' }}>
                    Energo
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1,marginLeft:'-100px', fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px', color: '#08781b' }}>
                    Term
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {['/home', '/measurements', '/energy-charts', '/temperatures', '/prim-sec-temps', '/account-settings'].map((path, index) => (
                        <NavLink 
                            key={index} 
                            to={path} 
                            style={({ isActive }) => ({
                                color: '#fff', // Uvek belа boja
                                textDecoration: 'none',
                                fontWeight: isActive ? 'bold' : 'normal',
                                fontSize: '13px',
                                transition: 'transform 0.3s', // Samo transformacija
                                marginRight: '24px',
                                display: 'inline-block',
                            })}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.1)'; // Povećanje
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)'; // Vraćanje na normalno
                            }}
                        >
                            {getNavLinkText(path)}
                        </NavLink>
                    ))}
                    <Button 
                        variant="outlined" 
                        onClick={handleLogout} 
                        sx={{
                            color: '#fff',
                            borderColor: '#fff',
                            '&:hover': {
                                backgroundColor: '#d9ab04',
                                borderColor: '#d9ab04',
                            }
                        }}
                    >
                        Odjavi se
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

const getNavLinkText = (path) => {
    switch (path) {
        case '/home':
            return '📊 PREGLED SISTEMA';
        case '/measurements':
            return '📈 MERENJA';
        case '/energy-charts':
            return '⚡ POTROŠNJA ENERGIJE';
        case '/temperatures':
            return '🌡️ TEMPERATURE';
        case '/prim-sec-temps':
            return '🗓️ DNEVNI PREGLED';
        case '/account-settings':
            return '👤 NALOG';
        default:
            return '';
    }
};

export default Navbar;
