import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import alertService from './alertService';

const Login = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  
  // URL de API con respaldo
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';
  
  // Comprobar si hay un usuario en localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      alertService.info('Ya hay una sesión iniciada. Redirigiendo...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [navigate]);
  
  const handleBackClick = () => {
    navigate('/'); 
  };

  const handleRegistro = () => {
    navigate('/registro'); 
  };

  const handleLogin = async () => {
    // Validación de campos
    if (!username.trim() || !password.trim()) {
      alertService.warning('Por favor, completa todos los campos');
      return;
    }
    
    try {
      setIsLoading(true);
      alertService.info('Iniciando sesión...');
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        alertService.error(errorData.message || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      // Obtener los datos de la respuesta
      const data = await response.json();
      console.log('Respuesta completa:', data);

      // Guardar el ID del usuario en localStorage
      localStorage.setItem('userId', data.user.id);
      
      alertService.success('Inicio de sesión exitoso');

      // Redirigir según el tipo de usuario
      setTimeout(() => {
        if (data.user.type === 2) {
          navigate('/profesor'); // Redirige a /profesor si el tipo es 2 (profesor)
        } else if (data.user.type === 1) { // Cambiado de 0 a 1
          navigate('/tutor'); // Redirige a /tutor si el tipo es 1 (tutor/admin)
        } else {
          setError(`Tipo de usuario desconocido: ${data.user.type}`);
          alertService.error(`Tipo de usuario desconocido: ${data.user.type}`);
        }
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      setError('Error de conexión al servidor');
      alertService.error('Error de conexión al servidor');
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  // Manejar envío con Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      {/* Fondo de estrellas mejorado */}
      <div className="stars-container">
        {Array.from({ length: 50 }).map((_, index) => (
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
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="pin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        {error && <p className="error-message">{error}</p>} 

        <button className="register-btn" onClick={handleRegistro} disabled={isLoading}>Regístrate</button>
      </div>
      <button className="login-btn" onClick={handleBackClick} style={{marginTop: '20px', maxWidth: '200px'}} disabled={isLoading}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default Login;