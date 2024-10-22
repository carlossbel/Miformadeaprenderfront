import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate(); // Hook para la navegación
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [error, setError] = useState(''); // Estado para manejar errores

  const handleBackClick = () => {
    navigate('/'); // Redirige a la ruta principal "/"
  };

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
        setError(errorData.message); // Manejo de error
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

  return (
    <div className="login-container"> 
      <img src={logo} alt="Logo" className="logo1" /> 
      <div className="input-box1">
        <input
          type="text"
          placeholder="Usuario"
          className="pin-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Actualiza el estado del nombre de usuario
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="pin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
        />
        <button className="login-btn" onClick={handleLogin}>Iniciar Sesión</button>
        {error && <p className="error-message">{error}</p>} {/* Mensaje de error */}

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
