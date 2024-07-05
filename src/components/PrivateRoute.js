import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = user !== null;
  const isAdmin = isAuthenticated && user.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && isAdmin) {
    return <Navigate to="/admin" />;
  
  }

  return children;
};

export default PrivateRoute;
