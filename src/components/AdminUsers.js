import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleValidate = async (userId) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/validate/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/delete/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  return (
    <div className="admin-users">
      <h3>Gerenciar Usuários</h3>
      {error && <p>Erro ao carregar usuários: {error.message}</p>}
      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Validado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.validated ? 'Sim' : 'Não'}</td>
              <td>
                <button onClick={() => handleValidate(user._id)}>Validar</button>
                <button onClick={() => handleDelete(user._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
