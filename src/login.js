import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate(); // Hook para la navegación

  const handleBackClick = () => {
    navigate('/'); // Redirige a la ruta principal "/"
  };

  

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo1" /> 
      <div className="input-box1">
        <input type="text" placeholder="Usuario" className="pin-input" />
        <input type="password" placeholder="Contraseña" className="pin-input" />
        <button className="login-btn">Iniciar Sesión</button>

        <button className="register-btn">Regístrate</button>
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

export default Login;
