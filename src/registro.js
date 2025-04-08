import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './Logo_morado.png'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Registro = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); 
  
  const handleBackClick = () => {
    navigate('/'); 
  };

  const handleRegistro = async () => {
    console.log('Intentando registrar con los siguientes datos:', { username, password, email }); // Log de los datos enviados
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }), 
      });
    
      console.log('Respuesta del servidor:', response); // Log de la respuesta inicial del servidor
    
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error del servidor:', errorData); // Log de los errores del servidor
        setError(errorData.message);
        return;
      }
    
      const data = await response.json();
      console.log('Registro exitoso. Respuesta del servidor:', data); // Log de la respuesta exitosa
      setError('');
      navigate('/login');
    } catch (error) {
      console.error('Error de conexión al servidor:', error); // Log de errores de conexión
      setError('Error de conexión al servidor');
    }
  };

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
          placeholder="Nombre completo"
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
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="pin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />

        <button className="register-btn" onClick={handleRegistro}>Regístrate</button>
        {error && <div className="error-message">{error}</div>}
      </div>
      <button className="login-btn" onClick={handleBackClick} style={{marginTop: '20px', maxWidth: '200px'}}>Volver al Inicio</button>
    </div>
  );
};

export default Registro;