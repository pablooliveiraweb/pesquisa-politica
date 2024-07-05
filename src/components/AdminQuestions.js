import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: '', options: [], questionType: 'button' });
  const [newOption, setNewOption] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/questions', newQuestion);
      setQuestions([...questions, response.data]);
      setNewQuestion({ text: '', options: [], questionType: 'button' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOption = async () => {
    try {
      await axios.put(`http://localhost:5001/api/questions/${selectedQuestionId}/add-option`, { text: newOption });
      fetchQuestions();
      setNewOption('');
      setSelectedQuestionId('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/questions/${id}`);
      setQuestions(questions.filter(question => question._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-questions">
      <h3>Gerenciar Perguntas</h3>
      <div>
        <input
          type="text"
          value={newQuestion.text}
          onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
          placeholder="Texto da Pergunta"
        />
        <select
          value={newQuestion.questionType}
          onChange={(e) => setNewQuestion({ ...newQuestion, questionType: e.target.value })}
        >
          <option value="button">Botão</option>
          <option value="text">Texto</option>
        </select>
        <button onClick={handleAddQuestion}>Adicionar Pergunta</button>
      </div>
      <div>
        <select value={selectedQuestionId} onChange={(e) => setSelectedQuestionId(e.target.value)}>
          <option value="">Selecione a Pergunta</option>
          {questions.map((question) => (
            <option key={question._id} value={question._id}>{question.text}</option>
          ))}
        </select>
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Nova Opção"
        />
        <button onClick={handleAddOption} disabled={!selectedQuestionId}>Adicionar Opção</button>
      </div>
      <h3>Perguntas Existentes</h3>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>
            {question.text}
            <ul>
              {question.options.map((option, index) => (
                <li key={index}>{option.text}</li>
              ))}
            </ul>
            <button onClick={() => handleDeleteQuestion(question._id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminQuestions;
