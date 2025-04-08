import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './tutor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter, faSearch, faHome, faUserPlus, faLink } from '@fortawesome/free-solid-svg-icons';

const Tutor = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [students, setStudents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokensModalOpen, setIsTokensModalOpen] = useState(false);
  const [isTokenDetailsModalOpen, setIsTokenDetailsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [activeTokens, setActiveTokens] = useState([]);
  const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [professorsWithGroups, setProfessorsWithGroups] = useState([]);
  
  const [newProfesor, setNewProfesor] = useState({
    username: '',
    password: '',
    email: '',
  });

  const [message, setMessage] = useState(null);

  const [isProfessorSection, setIsProfessorSection] = useState(true);
  const [professors, setProfessors] = useState([]);
  const [newStudent, setNewStudent] = useState({
    username: '',
    password: '',
    email: '',
    professorId: '',
    groupId: '',
  });

  const userId = localStorage.getItem('userId');
  console.log('ID del usuario:', userId);

  // URL de API con respaldo
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';
  
  const ProfessorsWithGroups = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profesores-grupo`);
      if (response.ok) {
        const data = await response.json();
        console.log('Datos de profesores con grupos:', data);
        if (Array.isArray(data.professors)) {
          setProfessorsWithGroups(data.professors);
        } else {
          console.error('La API no devolvió un arreglo válido.');
          setProfessorsWithGroups([]);
        }
      } else {
        console.error('Error al obtener profesores y grupos. Código:', response.status);
        setProfessorsWithGroups([]);
      }
    } catch (error) {
      console.error('Error de conexión al servidor:', error);
      setProfessorsWithGroups([]);
    }
  };
  
  useEffect(() => {
    ProfessorsWithGroups();
  }, []);
  
  // Función para obtener profesores
  const fetchProfessors = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/getProfesores`);
      if (response.ok) {
        const data = await response.json();
        setProfessors(data.professors);
      } else {
        console.error('Error al obtener los profesores:', response.status);
        setProfessors([]);
      }
    } catch (error) {
      console.error('Error de conexión al servidor:', error);
      setProfessors([]);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/buscar2`);
      if (response.ok) {
        const data = await response.json();
        console.log('Datos de grupos:', data);
        if (Array.isArray(data.grupos)) {
          setGroups(data.grupos);
        } else {
          console.error('La API no devolvió un arreglo válido.');
          setGroups([]);
        }
      } else {
        console.error('Error al obtener los grupos. Código:', response.status);
        setGroups([]);
        // Mostrar mensaje de error
        setErrorMessage(`Error al obtener grupos: ${response.status}`);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error de conexión al servidor:', error);
      setGroups([]);
      setErrorMessage('Error de conexión al servidor');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Llama a fetchGroups cuando se monta el componente
  useEffect(() => {
    fetchGroups();
  }, []);

  // Llama a fetchProfessors cuando se monta el componente
  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleBuscar = (newGroup) => {
    setSelectedGroup(newGroup);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const [newProfessor, setNewProfessor] = useState({
    username: '',
    password: '',
    email: '',
  });

  //Añadir profesor:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfesor({ ...newProfesor, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  // Función para registrar un grupo
  const handleRegisterGrupo = async () => {
    if (!newStudent.groupId || !newStudent.professorId) {
      setErrorMessage('Por favor selecciona un grupo y un profesor.');
      return;
    }

    console.log('Intentando asignar:', {
      grupo: newStudent.groupId,
      profesor: newStudent.professorId
    });

    try {
      const response = await fetch(`${API_URL}/auth/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grupo: newStudent.groupId,
          profesor: newStudent.professorId,
        }),
      });

      console.log('Respuesta del servidor:', response);
      const data = await response.json();
      console.log('Datos de respuesta:', data);

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Grupo y profesor registrados exitosamente.');
        setNewStudent({ ...newStudent, groupId: '', professorId: '' });
        
        // Actualizar la lista de profesores con grupos después de la asignación exitosa
        ProfessorsWithGroups();
      } else {
        setErrorMessage(data.message || 'Error al registrar el grupo.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setErrorMessage('Ocurrió un error al registrar el grupo.');
    }
  };

  //Registro Profesor
  const handleRegisterProfessor = async () => {
    if (!newProfessor.username || !newProfessor.password || !newProfessor.email) {
      setErrorMessage('Por favor completa todos los campos.');
      setSuccessMessage('');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/auth/registro-profesor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newProfessor.username,
          password: newProfessor.password,
          email: newProfessor.email,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccessMessage('Profesor registrado exitosamente.');
        setErrorMessage('');
        setNewProfessor({ username: '', password: '', email: '' });
        // Actualizar la lista de profesores
        fetchProfessors();
      } else {
        setErrorMessage(data.message || 'Error al registrar el profesor.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      setErrorMessage('Ocurrió un error al registrar el profesor.');
      setSuccessMessage('');
    }
  };

  const handleDetailsClick = (student) => {
    alert(`Detalles de ${student.name}`);
  };

  const fetchTokenDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/token-details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        setError(`Error al obtener los detalles del token: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log('Tokens recibidos:', data);
      
      // Procesar los tokens para mostrar tiempo restante
      const processedTokens = data.map(token => {
        // Convertir la fecha de creación a objeto Date
        const creationTime = new Date(token.created_at);
        const currentTime = new Date();
        
        // Calcular minutos transcurridos
        const diffInMs = currentTime - creationTime;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        
        // Calcular tiempo restante (60 min - tiempo transcurrido)
        const timeLeftInMinutes = Math.max(0, 60 - diffInMinutes);
        const timeLeftInSeconds = Math.max(0, 59 - Math.floor((diffInMs / 1000) % 60));
        
        return {
          ...token,
          time_left_minutes: timeLeftInMinutes,
          time_left_seconds: timeLeftInSeconds,
        };
      });
      
      setTokenDetails(processedTokens);
      setActiveTokens(processedTokens);
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleGroupChange = async (group) => {
    setSelectedGroup(group);
    setDropdownOpen(false);
    console.log(`Grupo seleccionado: ${group}`);
    
    try {
      const response = await fetch(`${API_URL}/auth/alumnos/${group}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStudents(data.usuarios);
      } else {
        console.error(`No se encontraron usuarios en el grupo ${group}`);
      }
    } catch (error) {
      console.error('Error de conexión al servidor', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleSecondaryAction = () => {
    console.log("Nuevo botón presionado");
  };

  const openTokensModal = () => {
    setIsTokensModalOpen(true);
    fetchTokenDetails();
  };

  const toggleProfessorModal = () => {
    setIsProfessorModalOpen(!isProfessorModalOpen);
  };

  const toggleSection = () => {
    setIsProfessorSection(!isProfessorSection);
  };

  const closeProfessorModal = () => {
    setIsProfessorModalOpen(false);
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
      const response = await fetch(`${API_URL}/auth/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group: newGroup }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.token) {
          setError(data.message);
          setToken(data.token);
        } else {
          setToken(data.token);
          setTimeLeft(3600);
          openTokenDetailsModal();
          setNewGroup('');
          closeModal();
          fetchTokenDetails();
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
      {/* Fondo de estrellas */}
      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-111" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-222" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-333" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-444" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-555" />
      </div>
      
      {/* Barra de navegación */}
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <input type="text" placeholder="Buscar..." className="navbar-search" />
        <button className="navbar-filter" onClick={handleLogout}>
          <FontAwesomeIcon icon={faHome} /> Inicio
        </button>
    
        <button className="navbar-generate" onClick={openModal}>
          Generar quiz
        </button>
      </div>
      
      {/* Botones fijos */}
      <div className="button-group">
        <button className="bottom-left-button" onClick={() => {
          toggleProfessorModal();
          setIsProfessorSection(true);
        }}>
          <FontAwesomeIcon icon={faUserPlus} /> Agregar profesor
        </button>
        <button className="bottom-left-button assign-button" onClick={() => {
          toggleProfessorModal();
          setIsProfessorSection(false);
        }}>
          Asignar
        </button>
      </div>
      
      <button className="fixed-token-button" onClick={openTokensModal}>
        <FontAwesomeIcon icon={faLink} /> Tokens activos
      </button>
  
      {/* Modal para agregar profesor o asignar grupos */}
      {isProfessorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="card__title">{isProfessorSection ? 'Agregar Profesor' : 'Asignar profesor a grupo'}</span>
            <p className="card__content">
              {isProfessorSection ? 'Completa el formulario para agregar un nuevo profesor.' : 'Completa el formulario para asignar un profesor a un grupo.'}
            </p>
            <div className="card__form">
              {isProfessorSection ? (
                <>
                  <input
                    type="text"
                    placeholder="Nombre del profesor"
                    className="modal-input"
                    value={newProfessor.username}
                    onChange={(e) =>
                      setNewProfessor({ ...newProfessor, username: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Contraseña del profesor"
                    className="modal-input"
                    value={newProfessor.password}
                    onChange={(e) =>
                      setNewProfessor({ ...newProfessor, password: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Correo del profesor"
                    className="modal-input"
                    value={newProfessor.email}
                    onChange={(e) =>
                      setNewProfessor({ ...newProfessor, email: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="professorId">Profesor:</label>
                    <select
                      className="modal-input"
                      id="professorId"
                      value={newStudent.professorId}
                      onChange={(e) => setNewStudent({ ...newStudent, professorId: e.target.value })}
                    >
                      <option value="">Selecciona un profesor</option>
                      {professors.length > 0 ? (
                        professors.map((professor) => (
                          <option key={professor.id} value={professor.id}>
                            {professor.username}
                          </option>
                        ))
                      ) : (
                        <option value="">No hay profesores disponibles</option>
                      )}
                    </select>
                  </div>
  
                  <div>
                    <label htmlFor="groupId">Grupo:</label>
                    <select
                      className="modal-input"
                      id="groupId"
                      value={newStudent.groupId}
                      onChange={(e) => setNewStudent({ ...newStudent, groupId: e.target.value })}
                    >
                      <option value="">Selecciona un grupo</option>
                      {groups.length > 0 ? (
                        groups.map((group, index) => (
                          <option key={index} value={group.grupo}>
                            {group.grupo}
                          </option>
                        ))
                      ) : (
                        <option value="">No hay grupos disponibles</option>
                      )}
                    </select>
                  </div>
                </>
              )}
  
              {errorMessage && (
                <div className="error-message-box">
                  <span className="error-icon">⚠️</span>
                  <p>{errorMessage}</p>
                </div>
              )}
  
              {successMessage && (
                <div className="success-message-box">
                  <span className="success-icon">✔️</span>
                  <p>{successMessage}</p>
                </div>
              )}
  
              <button className="sign-up" onClick={isProfessorSection ? handleRegisterProfessor : handleRegisterGrupo}>
                {isProfessorSection ? 'Registrar Profesor' : 'Asignar a Grupo'}
              </button>
            </div>
            <button className="modal-close" onClick={closeProfessorModal}>Cerrar</button>
            <div className="modal-switch-section">
              <button onClick={toggleSection}>
                {isProfessorSection ? 'Cambiar a Asignar' : 'Cambiar a Añadir'}
              </button>
            </div>
          </div>
        </div>
      )}
  
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
            <button className="modal-button" onClick={handleGenerateToken}>Generar token</button>
            <button className="modal-close" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
  
      {/* Modal para token generado */}
      {isTokenDetailsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Detalles del Token Generado</h3>
            <p><strong>Grupo:</strong> {newGroup}</p>
            <p><strong>Token:</strong> {token}</p>
            <p><strong>Tiempo restante:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
            <button className="modal-close" onClick={closeTokenDetailsModal}>Cerrar</button>
          </div>
        </div>
      )}
  
      {/* Modal para tokens activos */}
      {isTokensModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Tokens Activos</h3>
            {activeTokens && activeTokens.length > 0 ? (
              <ul className="token-details">
                {activeTokens.map((tokenDetail, index) => (
                  <li key={index} className="token-item">
                    <p><strong>Token:</strong> {tokenDetail.token}</p>
                    <p><strong>Grupo:</strong> {tokenDetail.grupo}</p>
                    <p className="token-time">
                      <strong>Tiempo restante:</strong> {tokenDetail.time_left_minutes} minutos y {tokenDetail.time_left_seconds} segundos
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay tokens activos.</p>
            )}
            <button className="modal-close" onClick={closeTokensModal}>Cerrar</button>
          </div>
        </div>
      )}
  
      {/* Contenido principal - Lista de profesores */}
      <div className="main-content1">
        <h2 className="group-title1">Profesores y Grupos Asignados</h2>
        <div className="students-list1">
          {professorsWithGroups.length > 0 ? (
            professorsWithGroups.map((professor) => (
              <div key={professor.profesor_id} className="professor-group1">
                <p className="professor-name1"><strong>{professor.profesor_nombre}</strong></p>
                <div className="groups-container1">
                  <p><strong>Grupos asignados:</strong></p>
                  <div className="group-boxes1">
                    {professor.grupos_asignados && professor.grupos_asignados.length > 0 ? (
                      professor.grupos_asignados.map((group, index) => (
                        <div key={index} className="group-box1">
                          {group}
                        </div>
                      ))
                    ) : (
                      <p className="no-groups">No hay grupos asignados</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-professors">No se encontraron profesores.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutor;