import React, { useState } from 'react';
import axios from 'axios';
import ModalComponent from '../components/ModalComponent';
import '../styles.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        onLoginSuccess();
      } else {
        setModalMessage('Erro ao efetuar login');
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setModalMessage(error.response.data.error);
      } else {
        setModalMessage('Erro ao efetuar login');
      }
      setIsModalOpen(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', { username, password });
      if (response.data.message === 'User registered successfully') {
        setIsLogin(true);
        setModalMessage('Registro realizado com sucesso! Por favor, aguarde a aprovação do admin.');
        setIsModalOpen(true);
      } else {
        setModalMessage('Falha ao registrar usuário');
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setModalMessage(error.response.data.error);
      } else {
        setModalMessage('Falha ao registrar usuário');
      }
      setIsModalOpen(true);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Registrar Usuário'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? 'Login' : 'Registrar Usuário'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Registrar Usuário' : 'Já possui cadastro? Faça login'}
      </button>
      <ModalComponent
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default Login;
