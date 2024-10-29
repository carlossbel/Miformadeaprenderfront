import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Datos = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const handleBackClick = () => {
    navigate('/'); 
  };

  const handleCuestionario = () => {
    navigate('/cuestionario'); 
  };

  /*
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message); 
        return;
      }

      const data = await response.json();
      console.log(data); 
      navigate('/cuestionario'); 
    } catch (error) {
      setError('Error de conexión al servidor'); 
      console.error('Error:', error);
    }
  };

  */

  return (
    <div className="login-container"> 
      <img src={logo} alt="Logo" className="logo1" /> 
      <div className="input-box1">
        <input
          type="text"
          placeholder="Nombre Completo"
          className="pin-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Correo Electronico"
          className="pin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="login-btn" onClick={handleCuestionario}>Ingresar</button>
        {error && <p className="error-message">{error}</p>} 

        <div className="stars-container">
          <FontAwesomeIcon icon={faStar} className="star-icon star-11" />
          <FontAwesomeIcon icon={faStar} className="star-icon star-22" />
          <FontAwesomeIcon icon={faStar} className="star-icon star-33" />
          <FontAwesomeIcon icon={faStar} className="star-icon star-44" />
          <FontAwesomeIcon icon={faStar} className="star-icon star-55" />
        </div>
      </div>
      <button className="login-btn" onClick={handleBackClick}>Volver al Inicio</button>
    </div>
  );
};

export default Datos;
