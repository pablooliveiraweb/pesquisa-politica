import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Login from './components/Login';
import Questionnaire from './components/Questionnaire';
import AdminPanel from './components/AdminPanel';
import Report from './components/Report';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ Component }) => {
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/tokens/verify/${token}`);
        setIsValidToken(response.data.valid);
        if (!response.data.valid) {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isValidToken) {
    return (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        appElement={document.getElementById('root')}
      >
        <div style={{ textAlign: 'center' }}>
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" color="#ff0000" />
          <h2>Acesso negado ou token inválido</h2>
          <p>Verifique o email cadastrado, pois nele contém o seu token de acesso!</p>
        </div>
      </Modal>
    );
  }

  return <Component />;
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
