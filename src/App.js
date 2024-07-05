import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Questionnaire from './components/Questionnaire';
import AdminPanel from './components/AdminPanel';
import Report from './components/Report';

const ProtectedRoute = ({ Component }) => {
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/token/verify/${token}`);
        setIsValidToken(response.data.valid);
      } catch (error) {
        console.error('Error verifying token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isValidToken ? <Component /> : <div>Invalid token</div>;
};

const AppRoutes = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/questionnaire');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/admin/:token" element={<ProtectedRoute Component={AdminPanel} />} />
      <Route path="/report/:token" element={<ProtectedRoute Component={Report} />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
