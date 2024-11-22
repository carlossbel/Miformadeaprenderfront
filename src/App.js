import React, { useState } from 'react';
import './App.css';
import logo from './Logo_morado.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la modal
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Estado para manejar la modal de error
  const [pin, setPin] = useState(''); // Estado para manejar el PIN del Quiz
  const [error, setError] = useState(''); // Estado para manejar errores
  const [username, setUsername] = useState(''); // Estado para manejar el nombre de usuario
  const [email, setEmail] = useState(''); // Estado para manejar el correo electrónico
  const [token, setToken] = useState(''); // Estado para almacenar el token temporalmente
const [grupo, setGrupo] = useState(''); // Estado para almacenar el grupo temporalmente
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleCuestionario = async () => {
    try {
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: pin }), // Envía el PIN como token
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error); // Guarda el mensaje de error
        openErrorModal(); // Abre la modal de error
        return;
      }
  
      const data = await response.json();
      console.log(data); // Log para depuración
  
      if (data.grupo) {
        setToken(pin); // Usa el PIN aquí para guardar el token
        setGrupo(data.grupo); // Guarda el grupo temporalmente
        setIsModalOpen(true); // Abre la modal si el token es válido
      } else {
        setError('Grupo no encontrado.'); // Maneja caso donde no se encuentra el grupo
        openErrorModal(); // Abre la modal de error
      }
    } catch (error) {
      setError('Error de conexión al servidor');
      console.error('Error:', error);
      openErrorModal(); // Abre la modal de error
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
  
    try {
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/datos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grupo, // Incluye el grupo almacenado
          username,
          email,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error); // Guarda el mensaje de error
        openErrorModal(); // Abre la modal de error
        return;
      }
  
      const data = await response.json();
      console.log(data); // Log para depuración
      localStorage.setItem('userId', data.insertId);
  
      closeModal(); // Cierra la modal después de enviar
      setPin(''); // Limpia el PIN
      setUsername(''); // Limpia el nombre de usuario
      setEmail(''); // Limpia el correo electrónico
      setToken(''); // Limpia el token temporal
      setGrupo(''); // Limpia el grupo temporal
  
      // Redirige a la página ./cuestionario
      navigate('./cuestionario');
    } catch (error) {
      setError('Error de conexión al servidor');
      console.error('Error:', error);
      openErrorModal(); // Abre la modal de error
    }
  };
  
  

  const closeModal = () => {
    setIsModalOpen(false); // Cierra la modal
  };

  const openErrorModal = () => {
    setIsErrorModalOpen(true); // Abre la modal de error
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false); // Cierra la modal de error
  };

  return (
    <div className="login-container">
      <div className="content-box">
        <img src={logo} alt="Logo" className="logo" />
        <div className="input-box">
          <input 
            type="text" 
            placeholder="PIN del Quiz" 
            className="pin-input" 
            value={pin}
            onChange={(e) => setPin(e.target.value)} // Actualiza el estado del PIN
          />
          <button className="login-btn" onClick={handleCuestionario}>Ingresar</button>
        </div>
        {error && <p className="error-text">{error}</p>} {/* Muestra mensaje de error si existe */}
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

      {/* Modal de Éxito */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Ingresa tus datos</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Usuario" 
                className="modal-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Actualiza el estado del nombre de usuario
                required 
              />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="modal-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del correo electrónico
                required 
              />
              <button type="submit" className="modal-btn">Enviar</button>
            </form>
            <button className="modal-close" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de Error */}
      {isErrorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="modal-close" onClick={closeErrorModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
