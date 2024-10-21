import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import MeasurementsPage from './pages/MeasurementsPage';
import EnergyChartsPage from './pages/EnergyChartsPage';
import TemperaturePage from './pages/TemperaturePage';
import PrimSecTempsPage from './pages/PrimSecTempsPage';
import AccountSettingsPage from './pages/AccountSettingsPage';


const AppContent = () => {
    const user = JSON.parse(localStorage.getItem('user_data'));

    return (
        <div>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account-settings" element={<ProtectedRoute element={<AccountSettingsPage />} />} />
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/measurements" element={<ProtectedRoute element={<MeasurementsPage />} />} />
                <Route path="/energy-charts" element={<ProtectedRoute element={<EnergyChartsPage />} />} />
                <Route path="/temperatures" element={<ProtectedRoute element={<TemperaturePage />} />} />
                <Route path="/prim-sec-temps" element={<ProtectedRoute element={<PrimSecTempsPage />} />} />
                <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
