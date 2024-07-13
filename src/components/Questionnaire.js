// src/components/Questionnaire.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../components/ModalComponent';
import '../styles.css';
import { CiTextAlignCenter } from 'react-icons/ci';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://vota.chatcontroll.com/api/questions');
      setQuestions(response.data);
    } catch (error) {
      setModalMessage('Error fetching questions');
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleOptionClick = (option, field) => {
    setFormData({ ...formData, [field]: option });
  };

  const handleQuestionOptionClick = (option) => {
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
      setModalMessage('Respostas enviadas com sucesso!');
      setIsModalOpen(true);
      resetForm();
    } catch (error) {
      setModalMessage('Erro ao enviar respostas.');
      setIsModalOpen(true);
    }
  };

  const resetForm = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setSelectedOption('');
    setFormData({ name: '', neighborhood: '', address: '', ageRange: '', gender: '' });
    setIsSurveyCompleted(false);
  };

  return (
    <div className="container">
      {isAdmin && (
        <button onClick={() => navigate('/admin')}>Acessar Painel Admin</button>
      )}

      {currentQuestionIndex === 0 && (
        <div className='container-input'>
          <h2>Dados do Entrevistado</h2>
          <h3>Faixa Etária</h3>
          <div className="option-buttons age-range-buttons">
            {['16-24', '25-34', '35-44', '45-59', '60 ou +'].map((range) => (
              <button
                key={range}
                onClick={() => handleOptionClick(range, 'ageRange')}
                className={`option-button ${formData.ageRange === range ? 'selected' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
          <h3>Sexo</h3>
          <div className="option-buttons">
            {['Masculino', 'Feminino'].map((gender) => (
              <button
                key={gender}
                onClick={() => handleOptionClick(gender, 'gender')}
                className={`option-button ${formData.gender === gender ? 'selected' : ''}`}
              >
                {gender}
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentQuestionIndex(1)} disabled={!formData.ageRange || !formData.gender}>Iniciar Questionário</button>
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
                  onClick={() => handleQuestionOptionClick(option.value)}
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

      {currentQuestionIndex === questions.length + 1 && !isSurveyCompleted && (
        <div>
          <h2>Obrigado, Questionário Finalizado com Sucesso!</h2>
          <button onClick={() => setIsSurveyCompleted(true)}>Iniciar Nova Pesquisa.</button>
        </div>
      )}

      {isSurveyCompleted && (
        <div className='container-input'>
          <h2>Dados do Entrevistado</h2>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nome" required />
          <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Bairro" required />
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Endereço" required />
          <button onClick={submitResponses}>Enviar Respostas</button>
        </div>
      )}

      <ModalComponent
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default Questionnaire;
