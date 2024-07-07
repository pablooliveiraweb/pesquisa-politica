import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaQuestion, FaKey, FaDatabase, FaTachometerAlt } from 'react-icons/fa';
import '../styles.css';

// Registrar a escala de categoria, tooltip e outros elementos necessários
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('text');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [newOptions, setNewOptions] = useState(['']);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notification, setNotification] = useState('');
  const [visibleOptions, setVisibleOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchQuestions();
    fetchTokens();
    fetchInterviewData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tokens');
      setTokens(response.data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const fetchInterviewData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/interview-data');
      setInterviewData(response.data);
    } catch (error) {
      console.error('Error fetching interview data:', error);
      setNotification('Error fetching interview data');
    }
  };

  const handleValidateUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5001/api/users/${userId}/validate`);
      fetchUsers();
      showModal('Usuário validado com sucesso!');
    } catch (error) {
      console.error('Error validating user:', error);
      showModal('Erro ao validar usuário.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${userId}`);
      fetchUsers();
      showModal('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showModal('Erro ao excluir usuário.');
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion) {
      showModal('Por favor, insira o texto da pergunta.');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/questions', {
        text: newQuestion,
        type: newQuestionType,
        value: newQuestionType === 'text' ? 'Digite aqui sua resposta' : ''
      });
      setNewQuestion('');
      setNewQuestionType('text');
      fetchQuestions();
      showModal('Pergunta cadastrada com sucesso!');
    } catch (error) {
      console.error('Error adding question:', error);
      showModal('Erro ao cadastrar pergunta.');
    }
  };

  const handleAddOptions = async () => {
    if (!selectedQuestionId || newOptions.some(option => !option)) {
      showModal('Por favor, selecione uma pergunta e insira o texto das opções.');
      return;
    }

    try {
      await axios.post(`http://localhost:5001/api/questions/${selectedQuestionId}/options`, {
        options: newOptions.filter(option => option), // Filtra opções vazias
      });
      setNewOptions(['']);
      fetchQuestions();
      showModal('Opções cadastradas com sucesso!');
    } catch (error) {
      console.error('Error adding options:', error);
      showModal('Erro ao cadastrar opções.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5001/api/questions/${questionId}`);
      fetchQuestions();
      showModal('Pergunta excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting question:', error);
      showModal('Erro ao excluir pergunta.');
    }
  };

  const handleDeleteOption = async (questionId, optionId) => {
    try {
      await axios.delete(`http://localhost:5001/api/questions/${questionId}/options/${optionId}`);
      fetchQuestions();
      showModal('Opção excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting option:', error);
      showModal('Erro ao excluir opção.');
    }
  };

  const handleGenerateToken = async () => {
    try {
      await axios.post('http://localhost:5001/api/tokens');
      fetchTokens();
      showModal('Token gerado com sucesso!');
    } catch (error) {
      console.error('Error generating token:', error);
      showModal('Erro ao gerar token.');
    }
  };

  const handleDeleteToken = async (tokenId) => {
    try {
      await axios.delete(`http://localhost:5001/api/tokens/${tokenId}`);
      fetchTokens();
      showModal('Token excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting token:', error);
      showModal('Erro ao excluir token.');
    }
  };

  const handleResetDatabase = () => {
    setConfirmAction(() => async () => {
      try {
        await axios.delete('http://localhost:5001/api/reset');
        fetchQuestions();
        fetchTokens();
        showModal('Banco de dados resetado com sucesso!');
      } catch (error) {
        console.error('Error resetting database:', error);
        showModal('Erro ao resetar banco de dados.');
      }
    });
    openConfirmModal();
  };

  const addOptionField = () => {
    setNewOptions([...newOptions, '']);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = newOptions.map((option, i) => (i === index ? value : option));
    setNewOptions(updatedOptions);
  };

  const toggleOptionsVisibility = (questionId) => {
    setVisibleOptions(prevState => ({
      ...prevState,
      [questionId]: !prevState[questionId]
    }));
  };

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirmModal();
  };

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const generateChartData = () => {
    const labels = interviewData.map(item => item.neighborhood);
    const data = interviewData.map(item => item.count);
    const duration = interviewData.map(item => item.totalDuration);

    return {
      labels,
      datasets: [
        {
          label: 'Número de Entrevistas',
          data,
          backgroundColor: 'rgba(75,192,192,0.4)',
        },
        {
          label: 'Duração Total (minutos)',
          data: duration,
          backgroundColor: 'rgba(153,102,255,0.4)',
        },
      ],
    };
  };

  return (
    <div className="admin-panel">
      <nav className={`admin-nav ${isNavCollapsed ? 'collapsed' : ''}`}>
        <button onClick={handleNavToggle}>
          <span className="icon">{isNavCollapsed ? '☰' : '✖'}</span>
        </button>
        <button onClick={() => setActiveSection('dashboard')}>
          <FaTachometerAlt className="icon" /> {!isNavCollapsed && 'Dashboard'}
        </button>
        <button onClick={() => setActiveSection('users')}>
          <FaUsers className="icon" /> {!isNavCollapsed && 'Usuários'}
        </button>
        <button onClick={() => setActiveSection('questions')}>
          <FaQuestion className="icon" /> {!isNavCollapsed && 'Perguntas'}
        </button>
        <button onClick={() => setActiveSection('tokens')}>
          <FaKey className="icon" /> {!isNavCollapsed && 'Tokens'}
        </button>
        <button onClick={handleResetDatabase}>
          <FaDatabase className="icon" /> {!isNavCollapsed && 'Resetar Dados'}
        </button>
      </nav>
      <div className="admin-content">
        {notification && <div className="notification">{notification}</div>}
        {activeSection === 'dashboard' && (
          <div>
            <h3>Dashboard</h3>
            {interviewData.length > 0 ? (
              <Bar className='chart-info' data={generateChartData()} options={{ responsive: true, plugins: { tooltip: { enabled: true } } }} />
            ) : (
              <p>Carregando gráfico...</p>
            )}
            <div className="dashboard-info">
              <h4>Perguntas Cadastradas: {questions.length}</h4>
              <button onClick={() => setShowQuestions(!showQuestions)}>
                {showQuestions ? 'Ocultar' : 'Mostrar'} Perguntas
              </button>
              {showQuestions && (
                <ul>
                  {questions.map((question) => (
                    <li key={question._id}>{question.text}</li>
                  ))}
                </ul>
              )}
              <h4>Tokens Gerados: {tokens.length}</h4>
              <button onClick={() => setShowTokens(!showTokens)}>
                {showTokens ? 'Ocultar' : 'Mostrar'} Tokens
              </button>
              {showTokens && (
                <ul>
                  {tokens.map((token) => (
                    <li key={token._id}>{token.value}</li>
                  ))}
                </ul>
              )}
              <h4>Usuários Cadastrados: {users.length}</h4>
              <button onClick={() => setShowUsers(!showUsers)}>
                {showUsers ? 'Ocultar' : 'Mostrar'} Usuários
              </button>
              {showUsers && (
                <ul>
                  {users.map((user) => (
                    <li key={user._id}>{user.username}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {activeSection === 'users' && (
          <div>
            <h3>Usuários</h3>
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  {user.username} - {user.isAdmin ? 'Admin' : 'Usuário'}
                  <div className="actions">
                    <button onClick={() => handleValidateUser(user._id)}>Validar</button>
                    <button onClick={() => handleDeleteUser(user._id)}>Excluir</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === 'questions' && (
          <div>
            <h3>Perguntas</h3>
            <ul>
              {questions.map((question) => (
                <li key={question._id} className="question-item">
                  <div className="question-header" onClick={() => toggleOptionsVisibility(question._id)}>
                    <span className="question-text">{question.text} ({question.type})</span>
                    <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(question._id); }}>Excluir</button>
                  </div>
                  {question.type === 'option' && (
                    <ul className={`option-list ${visibleOptions[question._id] ? 'visible' : ''}`}>
                      {question.options.map((option) => (
                        <li key={option._id} className="option-item">
                          <span className="option-text">{option.value}</span>
                          <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteOption(question._id, option._id); }}>Excluir</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div>
              <h4>Adicionar Nova Pergunta</h4>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Texto da Pergunta"
              />
              <select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value)}
              >
                <option value="text">Texto</option>
                <option value="option">Opção</option>
              </select>
              <button onClick={handleAddQuestion}>Adicionar Pergunta</button>
            </div>
            <div>
              <h4>Adicionar Opções às Perguntas</h4>
              <select
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
              >
                <option value="">Selecione uma pergunta</option>
                {questions.filter(question => question.type === 'option').map((question) => (
                  <option key={question._id} value={question._id}>{question.text}</option>
                ))}
              </select>
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Texto da Opção ${index + 1}`}
                />
              ))}
              <button onClick={addOptionField}>Adicionar Mais Opções</button>
              <button onClick={handleAddOptions}>Adicionar Opções</button>
            </div>
          </div>
        )}
        {activeSection === 'tokens' && (
          <div>
            <h3>Gerenciamento de Tokens</h3>
            <button onClick={handleGenerateToken}>Gerar Novo Token</button>
            <ul>
              {tokens.map((token) => (
                <li key={token._id}>
                  {token.value}
                  <button className="delete-button" onClick={() => handleDeleteToken(token._id)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal for Notifications */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        appElement={document.getElementById('root')}
      >
        <h2>Notification</h2>
        <p>{modalMessage}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        className="modal"
        overlayClassName="modal-overlay"
        appElement={document.getElementById('root')}
      >
        <h2>Confirm Action</h2>
        <p>Tem certeza que deseja resetar o banco de dados? Isso excluirá todas as perguntas e respostas.</p>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={closeConfirmModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default AdminPanel;
