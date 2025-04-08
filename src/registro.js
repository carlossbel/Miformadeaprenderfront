import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import alertService from './alertService';

const Registro = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  
  // URL de API con respaldo
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';
  
  const handleBackClick = () => {
    navigate('/'); 
  };

  const handleRegistro = async () => {
    // Validación de campos
    if (!username.trim() || !password.trim() || !email.trim()) {
      alertService.warning('Por favor, completa todos los campos');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alertService.warning('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      alertService.warning('La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial');
      return;
    }
    
    console.log('Intentando registrar con los siguientes datos:', { username, password, email });
  
    try {
      setIsLoading(true);
      alertService.info('Procesando registro...');
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }), 
      });
    
      console.log('Respuesta del servidor:', response);
    
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error del servidor:', errorData);
        setError(errorData.message);
        alertService.error(errorData.message || 'Error en el registro');
        setIsLoading(false);
        return;
      }
    
      const data = await response.json();
      console.log('Registro exitoso. Respuesta del servidor:', data);
      setError('');
      
      alertService.success('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error de conexión al servidor:', error);
      setError('Error de conexión al servidor');
      alertService.error('Error de conexión al servidor');
      setIsLoading(false);
    }
  };

  // Manejar envío con Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRegistro();
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
          placeholder="Nombre completo"
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
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="pin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <button className="register-btn" onClick={handleRegistro} disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Regístrate'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
      <button className="login-btn" onClick={handleBackClick} style={{marginTop: '20px', maxWidth: '200px'}} disabled={isLoading}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default Registro;