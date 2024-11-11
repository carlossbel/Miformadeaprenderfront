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
  const [isTokensModalOpen, setIsTokensModalOpen] = useState(false);
  const [isTokenDetailsModalOpen, setIsTokenDetailsModalOpen] = useState(false); // Nueva modal para mostrar detalles del token
  const [newGroup, setNewGroup] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [activeTokens, setActiveTokens] = useState([]);


  useEffect(() => {
    fetchTokenDetails(); // Llama a la función cuando el componente se monta
  }, []); 


  const handleBackClick = () => {
    navigate('/');
  };



  const handleDetailsClick = (student) => {
    alert(`Detalles de ${student.name}`);
  };


  const fetchTokenDetails = async () => {
    try {
      const response = await fetch('https://miformadeaprender-token.onrender.com/auth/token-details', {
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
    fetchTokenDetails();
  };

  const closeTokensModal = () => {
    setIsTokensModalOpen(false);
  };

  const openTokenDetailsModal = () => {
    setIsTokenDetailsModalOpen(true);
  };

  const closeTokenDetailsModal = () => {
    setIsTokenDetailsModalOpen(false);
  };

  const handleGenerateToken = async () => {
  if (newGroup.trim() === '') {
    setError('Por favor ingrese un nombre de grupo');
    return;
  }

  try {
    const response = await fetch('https://miformadeaprender-token.onrender.com/auth/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ group: newGroup }),
    });

    const data = await response.json();

    if (response.ok) {
      // Si no existe un token, se genera uno nuevo
      if (!data.token) {
        setError(data.message); // Muestra el mensaje de que ya existe un token
        setToken(data.token); // Muestra el token existente
      } else {
        setToken(data.token); // Muestra el token recién generado
        setTimeLeft(3600); // Establece el tiempo de expiración (ejemplo de 1 hora)
        openTokenDetailsModal(); // Abre la modal con los detalles del token
        setNewGroup(''); // Limpiar el campo de grupo
        closeModal(); // Cierra el modal
        fetchTokenDetails(); // Recarga los detalles de los tokens
      }
    } else {
      setError('Error al generar el token');
    }
  } catch (error) {
    setError('Error de conexión al servidor');
    console.error('Error:', error);
  }
};




  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setToken('');
    }
  }, [timeLeft]);

  return (
    <div className="tutor-container">
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
        <button className="navbar-generate fixed-token-button" onClick={openTokensModal}>
          Tokens activos
        </button>
      </div>

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

      {/* Modal para mostrar detalles del token generado */}
      {isTokenDetailsModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Detalles del Token Generado</h3>
      <p><strong>Grupo:</strong> {newGroup}</p>
      <p><strong>Token:</strong> {token}</p>
      <p><strong>Tiempo restante:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
      <button className="modal-close" onClick={closeTokenDetailsModal}>
        Cerrar
      </button>
    </div>
  </div>
)}


      {isTokensModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Tokens Activos</h3>
            {activeTokens.length > 0 ? (
              <ul className="token-details">
                {activeTokens.map((tokenDetail, index) => (
                  <li key={index}>
                    <p><strong>Token:</strong> {tokenDetail.token}</p>
                    <p><strong>Grupo:</strong> {tokenDetail.grupo}</p>
                    <p>Tiempo restante: {tokenDetail.time_left_minutes} minutos y {tokenDetail.time_left_seconds} segundos</p>
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
      </div>
    </div>
  );
};

export default Tutor;
