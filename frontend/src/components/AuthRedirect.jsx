import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = ({ element }) => {
    const { user } = useAuth();

    return user ? <Navigate to="/home" /> : element;
};

export default AuthRedirect;