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

      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/login', {
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

      // Guardar el ID del usuario en localStorage
      localStorage.setItem('userId', data.user.id);  // Guardamos el id en localStorage

      // Redirigir según el tipo de usuario
      if (data.user.type === 2) {
        navigate('/profesor'); // Redirige a /profesor si el tipo es 2 (profesor)
      } else if (data.user.type === 0) {
        navigate('/tutor'); // Redirige a /tutor si el tipo es 0 (tutor)
      } else {
        setError('Tipo de usuario desconocido');
      }

    } catch (error) {
      setError('Error de conexión al servidor');
      console.error('Error:', error);
    }
  };

console.log(SERVER);  

  return (
    <div className="login-container"> 
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
