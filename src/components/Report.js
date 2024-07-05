import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const Report = () => {
  const [totalInterviewees, setTotalInterviewees] = useState(0);
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/questionnaire');
        setTotalInterviewees(response.data.length);
        calculatePercentages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResponses();
  }, []);

  const calculatePercentages = (responses) => {
    const questionCounts = {};
    const totalCounts = {};

    responses.forEach((response) => {
      response.responses.forEach((answer) => {
        if (!questionCounts[answer.question]) {
          questionCounts[answer.question] = {};
          totalCounts[answer.question] = 0;
        }
        if (!questionCounts[answer.question][answer.answer]) {
          questionCounts[answer.question][answer.answer] = 0;
        }
        questionCounts[answer.question][answer.answer]++;
        totalCounts[answer.question]++;
      });
    });

    const calculatedPercentages = Object.keys(questionCounts).map((question) => {
      const answers = Object.keys(questionCounts[question]).map((answer) => {
        return {
          answer: answer,
          count: questionCounts[question][answer],
          percentage: ((questionCounts[question][answer] / totalCounts[question]) * 100).toFixed(2)
        };
      });
      return {
        question: question,
        answers: answers
      };
    });

    setPercentages(calculatedPercentages);
  };

  return (
    <div className="container">
      <h2>Relatório de Respostas</h2>
      <p>Total de Entrevistados: {totalInterviewees}</p>
      {percentages.map((question, index) => (
        <div key={index}>
          <h3>{question.question}</h3>
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index}>
                {answer.answer}: {answer.count} ({answer.percentage}%)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Report;
