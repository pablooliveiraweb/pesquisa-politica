import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newToken, setNewToken] = useState('');
  const [currentToken, setCurrentToken] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchCurrentToken();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCurrentToken = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/token/verify/current');
      setCurrentToken(response.data.token);
    } catch (error) {
      console.error('Error fetching current token:', error);
    }
  };

  const handleGenerateToken = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/token/generate');
      setCurrentToken(response.data.token);
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  const handleChangeToken = async () => {
    try {
      await axios.post('http://localhost:5001/api/token/change', { newToken });
      setCurrentToken(newToken);
      setNewToken('');
    } catch (error) {
      console.error('Error changing token:', error);
    }
  };

  return (
    <div className="container">
      <h2>Painel Admin</h2>
      <h3>Gerar Novo Token</h3>
      <button onClick={handleGenerateToken}>Gerar Token</button>
      {currentToken && (
        <div>
          <h4>Token Atual</h4>
          <p>{currentToken}</p>
        </div>
      )}
      <h3>Trocar Token</h3>
      <input
        type="text"
        value={newToken}
        onChange={(e) => setNewToken(e.target.value)}
        placeholder="Novo Token"
      />
      <button onClick={handleChangeToken}>Trocar Token</button>
      <h3>Usuários</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
