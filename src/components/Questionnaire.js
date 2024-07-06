// src/components/Questionnaire.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Questionnaire = ({ isAdmin }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    neighborhood: '',
    address: '',
    ageRange: '',
    gender: ''
  });
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleTextChange = (e) => {
    setSelectedOption(e.target.value.toUpperCase());
  };

  const handleNext = () => {
    if (currentQuestionIndex <= questions.length) {
      const newResponses = [...responses];
      newResponses[currentQuestionIndex - 1] = { question: questions[currentQuestionIndex - 1].text, answer: selectedOption };
      setResponses(newResponses);
      setSelectedOption('');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitResponses = async () => {
    try {
      const finalResponses = responses.map((response, index) => response || { question: questions[index].text, answer: selectedOption });
      await axios.post('http://localhost:5001/api/questionnaire', { formData, responses: finalResponses });
      alert('Respostas enviadas com sucesso!');
      setCurrentQuestionIndex(0);
      setResponses([]);
      setSelectedOption('');
      setFormData({ name: '', neighborhood: '', address: '', ageRange: '', gender: '' });
    } catch (error) {
      alert('Erro ao enviar respostas.');
      console.error('Error submitting responses:', error);
    }
  };

  return (
    <div className="container">
      {isAdmin && (
        <button onClick={() => navigate('/admin')}>Acessar Painel Admin</button>
      )}
      {currentQuestionIndex === 0 && (
        <div>
          <h2>Dados do Entrevistado</h2>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nome" required />
          <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Bairro" required />
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Endereço" required />
          <select name="ageRange" value={formData.ageRange} onChange={handleInputChange} required>
            <option value="">Selecione a faixa etária</option>
            <option value="16-24">16-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-59">45-59</option>
            <option value="60+">60 ou +</option>
          </select>
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Selecione o sexo</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
          <button onClick={() => setCurrentQuestionIndex(1)} disabled={!formData.name || !formData.neighborhood || !formData.address || !formData.ageRange || !formData.gender}>Iniciar Questionário</button>
        </div>
      )}

      {currentQuestionIndex > 0 && currentQuestionIndex <= questions.length && (
        <div>
          <h2>{questions[currentQuestionIndex - 1]?.text}</h2>
          {questions[currentQuestionIndex - 1]?.type === 'text' ? (
            <div>
              <input
                type="text"
                placeholder={questions[currentQuestionIndex - 1]?.value || "Digite sua resposta"}
                value={selectedOption}
                onChange={handleTextChange}
                required
              />
              <button onClick={handleNext}>Próxima</button>
            </div>
          ) : (
            <div>
              {questions[currentQuestionIndex - 1]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.value)}
                  className={`option-button ${selectedOption === option.value ? 'selected' : ''}`}
                >
                  {option.value}
                </button>
              ))}
              <button onClick={handleNext} disabled={!selectedOption}>Próxima</button>
            </div>
          )}
        </div>
      )}

      {currentQuestionIndex === questions.length + 1 && (
        <div>
          <h2>Fim do Questionário</h2>
          <button onClick={submitResponses}>Enviar Respostas</button>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
