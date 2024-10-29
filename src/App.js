import React from 'react';
import './App.css';
import logo from './Logo_morado.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate correctamente

function App() {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleCuestionario = () => {
    navigate('/cuestionario'); 
  };

  const handleDatos = () => {
    navigate('/datos'); 
  };

  return (
    <div className="login-container">
      <div className="content-box">
        <img src={logo} alt="Logo" className="logo" />
        <div className="input-box">
          <input type="text" placeholder="PIN del Quiz" className="pin-input" />
          <button className="login-btn" onClick={handleDatos}>Ingresar</button>
        </div>
        <p className="login-text">
          Eres tutor/profesor <span className="login-link" onClick={handleLoginClick}>inicia sesión</span>
        </p>
      </div>
      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-1" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-2" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-3" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-4" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-5" />
      </div>
    </div>
  );
}

export default App;
