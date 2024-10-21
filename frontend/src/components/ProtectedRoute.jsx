import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const user = JSON.parse(localStorage.getItem('user_data'));

    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
