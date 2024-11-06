import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './tutor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

const Tutor = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState('Grupo IDGS10');
  const [students, setStudents] = useState([
    { name: 'Alumno 1', email: 'alumno1@example.com', grupo: 'Grupo IDGS10', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', grupo: 'Grupo IDGS10', style: 'Auditivo' },
    { name: 'Alumno 20', email: 'alumno20@example.com', grupo: 'Grupo IDGS10', style: 'Kinestésico' },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(group);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokensModalOpen, setIsTokensModalOpen] = useState(false); // Modal para los tokens activos
  const [newGroup, setNewGroup] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [tokenDetails, setTokenDetails] = useState(null); // Guardamos los detalles del token
  const [activeTokens, setActiveTokens] = useState([]); // Lista de tokens activos

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDetailsClick = (student) => {
    alert(`Detalles de ${student.name}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleGroupChange = (newGroup) => {
    setSelectedGroup(newGroup);
    setGroup(newGroup);
    setDropdownOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const openTokensModal = () => {
    setIsTokensModalOpen(true);
    fetchTokenDetails(); // Llamar a la función para obtener los tokens activos
  };

  const closeTokensModal = () => {
    setIsTokensModalOpen(false);
  };

  const handleGenerateToken = async () => {
    if (newGroup.trim() === '') {
      setError('Por favor ingrese un nombre de grupo');
      return;
    }

    try {
      const response = await fetch('http://localhost:5003/auth/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group: newGroup }),
      });

      if (!response.ok) {
        setError('Error al generar el token');
        return;
      }

      const data = await response.json();
      setToken(data.token);
      setTimeLeft(60); // Reiniciar el temporizador a 60 segundos
      alert(`Token generado para el grupo: ${newGroup}\nToken: ${data.token}`);
      setNewGroup('');
      closeModal();
      fetchTokenDetails(); // Llamar a la función para obtener los detalles del token
    } catch (error) {
      setError('Error de conexión al servidor');
      console.error('Error:', error);
    }
  };

  // Obtener los detalles de los tokens activos de la base de datos
  const fetchTokenDetails = async () => {
    try {
      const response = await fetch('http://localhost:5003/auth/token-details', {
        method: 'GET',
      });
      if (!response.ok) {
        setError('Error al obtener los detalles del token');
        return;
      }

      const data = await response.json();
      setTokenDetails(data);
      setActiveTokens(data); // Guardamos los tokens activos
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error:', error);
    }
  };

  // Manejo del temporizador
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setToken(''); // Borrar el token cuando el tiempo se acaba
    }
  }, [timeLeft]);

  return (
    <div className="tutor-container">
      {/* Navbar */}
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <input type="text" placeholder="Buscar..." className="navbar-search" />
        <button className="navbar-filter" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faFilter} /> Filtrar
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div onClick={() => handleGroupChange('Grupo IDGS10')}>Grupo IDGS10</div>
            <div onClick={() => handleGroupChange('Grupo IDGS20')}>Grupo IDGS20</div>
            <div onClick={() => handleGroupChange('Grupo IDGS30')}>Grupo IDGS30</div>
          </div>
        )}
        <button className="navbar-generate" onClick={openModal}>
          Generar quiz
        </button>
        {/* Botón para abrir la modal de Tokens activos */}
        <button className="navbar-generate fixed-token-button" onClick={openTokensModal}>
          Tokens activos
        </button>
      </div>

      {/* Modal para generar quiz */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Generar Quiz</h3>
            <input
              type="text"
              placeholder="Ingrese el nombre del grupo"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="modal-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button className="modal-button" onClick={handleGenerateToken}>
              Generar token
            </button>
            <button className="modal-close" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Tokens activos */}
      {isTokensModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Tokens Activos</h3>
      {activeTokens.length > 0 ? (
        <ul className="token-details"> {/* Agregada clase para estilizar los detalles de los tokens */}
          {activeTokens.map((tokenDetail, index) => (
            <li key={index}>
              <p><strong>Token:</strong> {tokenDetail.token}</p>
              <p><strong>Grupo:</strong> {tokenDetail.grupo}</p>
              <p><strong>Creado en:</strong> {new Date(tokenDetail.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tokens activos.</p>
      )}
      <button className="modal-close" onClick={closeTokensModal}>
        Cerrar
      </button>
    </div>
  </div>
)}


<div className="main-content">
  <h2 className="group-title">{selectedGroup}</h2>
  <div className="students-list">
    {students.map((student, index) => (
      <div key={index} className="student-row">
        <div className="student-name">{student.name}</div>
        <div className="student-email">{student.email}</div>
        <div className="student-grupo">{student.grupo}</div>
        <div className="student-style">{student.style}</div>
        <button className="details-button" onClick={() => handleDetailsClick(student)}>
          Detalles
        </button>
      </div>
    ))}
  </div>
  {token && (
    <p className="token-display">
      Token generado: {token} - Expira en: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
    </p>
  )}

      </div>
    </div>
  );
};

export default Tutor;
