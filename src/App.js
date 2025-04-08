import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './Logo_morado.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [grupo, setGrupo] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [animateStars, setAnimateStars] = useState(false);
  
  // URL del backend como variable de respaldo
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Iniciar animación de estrellas después de un pequeño retraso
    const timer = setTimeout(() => {
      setAnimateStars(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para añadir una alerta
  const addAlert = (message, type = 'info') => {
    const id = Date.now();
    // Agregar la nueva alerta al comienzo del array para una mejor experiencia visual
    setAlerts(prev => [{id, message, type}, ...prev]);
    
    // Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  // Función para eliminar una alerta
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCuestionario = async () => {
    if (!pin.trim()) {
      addAlert('Por favor ingresa el PIN del quiz', 'warning');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: pin }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        addAlert(data.error || 'PIN no válido', 'error');
        return;
      }
  
      if (data.grupo) {
        setToken(pin);
        setGrupo(data.grupo);
        setIsModalOpen(true);
        addAlert('PIN verificado correctamente', 'success');
      } else {
        addAlert('Grupo no encontrado', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      addAlert('Error de conexión al servidor', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim()) {
      addAlert('Por favor completa todos los campos', 'warning');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addAlert('Por favor ingresa un correo electrónico válido', 'warning');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/auth/datos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grupo,
          username,
          email,
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        addAlert(data.error || 'Error al guardar los datos', 'error');
        return;
      }
  
      localStorage.setItem('userId', data.userId);
      
      addAlert('¡Datos guardados correctamente!', 'success');
      
      // Cerrar modal y limpiar campos
      closeModal();
      setPin('');
      setUsername('');
      setEmail('');
      setToken('');
      setGrupo('');
      
      // Dar un momento para que el usuario vea el mensaje de éxito antes de redirigir
      setTimeout(() => {
        navigate('/cuestionario');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      addAlert('Error de conexión al servidor', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Componente de alerta personalizado integrado
  const CustomAlert = ({ id, message, type }) => {
    return (
      <div className={`custom-alert custom-alert-${type}`}>
        <div className="custom-alert-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </div>
        <div className="custom-alert-content">{message}</div>
        <button className="custom-alert-close" onClick={() => removeAlert(id)}>×</button>
        <div className="custom-alert-progress"></div>
      </div>
    );
  };

  return (
    <div className="login-container">
      {/* Fondo de estrellas mejorado */}
      <div className="stars-container">
        {Array.from({ length: 40 }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className={`star-icon star-${index} ${animateStars ? 'animate' : ''}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${0.5 + Math.random() * 1.5}rem`,
              opacity: 0.1 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${20 + Math.random() * 40}s`
            }}
          />
        ))}
      </div>
      
      <div className="content-box">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Mi Forma de Aprender</h1>
        <h2>Descubre tu estilo de aprendizaje</h2>
        
        <div className="input-box">
          <input 
            type="text" 
            placeholder="PIN del Quiz" 
            className="pin-input" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button className="login-btn" onClick={handleCuestionario}>Ingresar</button>
        </div>
        
        <p className="login-text">
          ¿Eres tutor o profesor? <span className="login-link" onClick={handleLoginClick}>Inicia sesión</span>
        </p>
      </div>

      {/* Modal para ingresar datos */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Ingresa tus datos</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Nombre completo" 
                className="modal-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="modal-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="modal-btn">Enviar</button>
            </form>
            <button className="modal-close" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Sistema de alertas */}
      <div className="alerts-container">
        {alerts.map(alert => (
          <CustomAlert
            key={alert.id}
            id={alert.id}
            message={alert.message}
            type={alert.type}
          />
        ))}
      </div>
    </div>
  );
}

export default App;