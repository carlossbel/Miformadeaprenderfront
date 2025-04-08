import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const SERVER = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  
  const handleBackClick = () => {
    navigate('/'); 
  };

  const handleRegistro = () => {
    navigate('/registro'); 
  };

  const handleLogin = async () => {
    try {
      console.log('Datos enviados:', { username, password });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
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

      // Obtener los datos de la respuesta
      const data = await response.json();
      console.log('Respuesta completa:', data); // Agregado para depuración

      // Guardar el ID del usuario en localStorage
      localStorage.setItem('userId', data.user.id);

      // Redirigir según el tipo de usuario
      if (data.user.type === 2) {
        navigate('/profesor'); // Redirige a /profesor si el tipo es 2 (profesor)
      } else if (data.user.type === 1) { // Cambiado de 0 a 1
        navigate('/tutor'); // Redirige a /tutor si el tipo es 1 (tutor/admin)
      } else {
        setError(`Tipo de usuario desconocido: ${data.user.type}`);
      }

    } catch (error) {
      setError('Error de conexión al servidor');
      console.error('Error:', error);
    }
  };

  console.log(SERVER);  

  return (
    <div className="login-container">
      {/* Fondo de estrellas mejorado */}
      <div className="stars-container">
        {Array.from({ length: 25 }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className={`star-icon`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${0.5 + Math.random() * 1.5}rem`,
              opacity: 0.1 + Math.random() * 0.5
            }}
          />
        ))}
      </div>
      
      <img src={logo} alt="Logo" className="logo1" /> 
      <div className="input-box1">
        <input
          type="text"
          placeholder="Nombre"
          className="pin-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="pin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="login-btn" onClick={handleLogin}>Iniciar Sesión</button>
        {error && <p className="error-message">{error}</p>} 

        <button className="register-btn" onClick={handleRegistro}>Regístrate</button>
      </div>
      <button className="login-btn" onClick={handleBackClick} style={{marginTop: '20px', maxWidth: '200px'}}>Volver al Inicio</button>
    </div>
  );
};

export default Login;