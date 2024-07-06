import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const Report = () => {
  const [generalReport, setGeneralReport] = useState({});
  const [neighborhoodReport, setNeighborhoodReport] = useState({});
  const [ageRangeReport, setAgeRangeReport] = useState({});
  const [addressReport, setAddressReport] = useState([]);
  const [error, setError] = useState(null);
  const [totalRespondents, setTotalRespondents] = useState(0);

  useEffect(() => {
    fetchGeneralReport();
    fetchNeighborhoodReport();
    fetchAgeRangeReport();
    fetchAddressReport();
  }, []);

  const fetchGeneralReport = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/report/general');
      setGeneralReport(response.data.report);
      setTotalRespondents(response.data.totalRespondents);
    } catch (error) {
      console.error('Error fetching general report:', error);
      setError('Error fetching general report');
    }
  };

  const fetchNeighborhoodReport = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/report/by-neighborhood');
      setNeighborhoodReport(response.data.report);
    } catch (error) {
      console.error('Error fetching neighborhood report:', error);
      setError('Error fetching neighborhood report');
    }
  };

  const fetchAgeRangeReport = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/report/age-range');
      setAgeRangeReport(response.data.report);
    } catch (error) {
      console.error('Error fetching age range report:', error);
      setError('Error fetching age range report');
    }
  };

  const fetchAddressReport = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/report/addresses');
      setAddressReport(response.data.report);
    } catch (error) {
      console.error('Error fetching address report:', error);
      setError('Error fetching address report');
    }
  };

  const calculatePercentages = (report) => {
    const totalVotes = Object.values(report).reduce((acc, val) => acc + val, 0);
    const percentages = {};

    Object.keys(report).forEach((key) => {
      percentages[key] = ((report[key] / totalVotes) * 100).toFixed(2);
    });

    return percentages;
  };

  return (
    <div className="container-report">
      <h1>Relatório Geral ({totalRespondents} entrevistados)</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Pergunta</th>
            <th>Resposta</th>
            <th>Quantidade</th>
            <th>Percentual</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(generalReport).map((question) => (
            <React.Fragment key={question}>
              <tr>
                <td rowSpan={Object.keys(generalReport[question]).length}>{question}</td>
                <td>{Object.keys(generalReport[question])[0]}</td>
                <td>{generalReport[question][Object.keys(generalReport[question])[0]]}</td>
                <td>{((generalReport[question][Object.keys(generalReport[question])[0]] / Object.values(generalReport[question]).reduce((acc, val) => acc + val, 0)) * 100).toFixed(2)}%</td>
              </tr>
              {Object.keys(generalReport[question]).slice(1).map((answer) => (
                <tr key={`${question}-${answer}`}>
                  <td>{answer}</td>
                  <td>{generalReport[question][answer]}</td>
                  <td>{((generalReport[question][answer] / Object.values(generalReport[question]).reduce((acc, val) => acc + val, 0)) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h1>Relatório por Bairro</h1>
      {Object.keys(neighborhoodReport).map((neighborhood) => {
        const percentages = calculatePercentages(neighborhoodReport[neighborhood]);
        return (
          <div key={neighborhood}>
            <h2>{neighborhood}</h2>
            <table>
              <thead>
                <tr>
                  <th>Resposta</th>
                  <th>Quantidade</th>
                  <th>Percentual</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(neighborhoodReport[neighborhood]).map((answer) => (
                  <tr key={`${neighborhood}-${answer}`}>
                    <td>{answer}</td>
                    <td>{neighborhoodReport[neighborhood][answer]}</td>
                    <td>{percentages[answer]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <h1>Relatório de Faixa Etária</h1>
      {Object.keys(ageRangeReport).length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Faixa Etária</th>
              <th>Resposta</th>
              <th>Quantidade</th>
              <th>Percentual</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(ageRangeReport).map((ageRange) => (
              <React.Fragment key={ageRange}>
                <tr>
                  <td rowSpan={Object.keys(ageRangeReport[ageRange]).length}>{ageRange}</td>
                  <td>{Object.keys(ageRangeReport[ageRange])[0]}</td>
                  <td>{ageRangeReport[ageRange][Object.keys(ageRangeReport[ageRange])[0]]}</td>
                  <td>{((ageRangeReport[ageRange][Object.keys(ageRangeReport[ageRange])[0]] / Object.values(ageRangeReport[ageRange]).reduce((acc, val) => acc + val, 0)) * 100).toFixed(2)}%</td>
                </tr>
                {Object.keys(ageRangeReport[ageRange]).slice(1).map((answer) => (
                  <tr key={`${ageRange}-${answer}`}>
                    <td>{answer}</td>
                    <td>{ageRangeReport[ageRange][answer]}</td>
                    <td>{((ageRangeReport[ageRange][answer] / Object.values(ageRangeReport[ageRange]).reduce((acc, val) => acc + val, 0)) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}

      <h1>Relatório por Endereço</h1>
      {addressReport.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Bairro</th>
              <th>Endereço</th>
              <th>Resposta</th>
            </tr>
          </thead>
          <tbody>
            {addressReport.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.neighborhood}</td>
                <td>{entry.address}</td>
                <td>{entry.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Report;
