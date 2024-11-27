import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './tutor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter, faSearch, faHome } from '@fortawesome/free-solid-svg-icons';

const Tutor = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [students, setStudents] = useState([
    { name: 'Alumno 1', email: 'alumno1@example.com', grupo: 'Grupo IDGS10', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', grupo: 'Grupo IDGS10', style: 'Auditivo' },
    { name: 'Alumno 20', email: 'alumno20@example.com', grupo: 'Grupo IDGS10', style: 'Kinestésico' },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokensModalOpen, setIsTokensModalOpen] = useState(false);
  const [isTokenDetailsModalOpen, setIsTokenDetailsModalOpen] = useState(false); // Nueva modal para mostrar detalles del token
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
  const [professors, setProfessors] = useState([]); // Lista de profesores
  const [newStudent, setNewStudent] = useState({
    username: '',
    password: '',
    email: '',
    professorId: '', // ID del profesor seleccionado
    groupId: '', // ID del grupo seleccionado
  });

  const userId = localStorage.getItem('userId');
console.log('ID del usuario:', userId);

  
  


  const ProfessorsWithGroups = async () => {
    try {
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/profesores-grupo');
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Verifica cómo se ven los datos
        if (Array.isArray(data.professors)) {
          setProfessorsWithGroups(data.professors); // Actualiza el estado
        } else {
          console.error('La API no devolvió un arreglo válido.');
          setProfessorsWithGroups([]); // Maneja el error adecuadamente
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
    const response = await fetch('https://miformadeaprender-all.onrender.com/auth/getProfesores');
    if (response.ok) {
      const data = await response.json();
      setProfessors(data.professors); // Actualizamos el estado con los profesores
    } else {
      console.error('Error al obtener los profesores:', response.status);
      setProfessors([]); // Limpia el estado si ocurre un error
    }
  } catch (error) {
    console.error('Error de conexión al servidor:', error);
    setProfessors([]); // Limpia el estado en caso de error
  }
};

const fetchGroups = async () => {
  try {
    const response = await fetch('https://miformadeaprender-all.onrender.com/auth/buscar2');
    if (response.ok) {
      const data = await response.json();
      console.log(data); // Verifica cómo se ven los datos
      if (Array.isArray(data.grupos)) {
        setGroups(data.grupos); // Actualiza el estado con los grupos
      } else {
        console.error('La API no devolvió un arreglo válido.');
        setGroups([]); // Maneja el error adecuadamente
      }
    } else {
      console.error('Error al obtener los grupos. Código:', response.status);
      setGroups([]);
    }
  } catch (error) {
    console.error('Error de conexión al servidor:', error);
    setGroups([]);
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


  //Mostrar grupos en combo 
 

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
    // Eliminar el ID del usuario del localStorage
    localStorage.removeItem('userId');

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/');
  };

  const handleRegisterGrupo = async () => {
    if (!newStudent.groupId || !newStudent.professorId) {
      alert('Por favor selecciona un grupo y un profesor.');
      return;
    }
  
    try {
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/asignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grupo: newStudent.groupId,  // Nombre del grupo
          profesor: newStudent.professorId, // ID del profesor
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Grupo y profesor registrados exitosamente.');
        setNewStudent({ ...newStudent, groupId: '', professorId: '' }); // Limpiar campos
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
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/registro-profesor', {
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
        setNewProfessor({ username: '', password: '', email: '' }); // Limpiar formulario
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
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/token-details', {
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

  const handleGroupChange = async (group) => {
    setSelectedGroup(group); // Cambia el grupo seleccionado
    setDropdownOpen(false);   // Cierra el menú desplegable
    console.log(`Grupo seleccionado: ${group}`);
    
    try {
      // Hacemos una consulta a la API para obtener los usuarios de ese grupo
      const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/alumnos/${group}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStudents(data.usuarios); // Actualizamos el estado con los usuarios del grupo
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
    // Agregar aquí la lógica deseada (por ejemplo, abrir un modal o realizar otra acción)
  };
  

  const openTokensModal = () => {
    setIsTokensModalOpen(true);
    fetchTokenDetails();
  };

  const toggleProfessorModal = () => {
    setIsProfessorModalOpen(!isProfessorModalOpen);
  };

  const toggleSection = () => {
  setIsProfessorSection(!isProfessorSection); // Alternar entre las secciones
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
    const response = await fetch('https://miformadeaprender-all.onrender.com/auth/generate-token', {
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
      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-111" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-222" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-333" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-444" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-555" />
      </div>
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <input type="text" placeholder="Buscar..." className="navbar-search" />
        <button className="navbar-filter"  onClick={handleLogout}>
          <FontAwesomeIcon icon={faHome} /> Inicio
        
        </button>
    
        <button className="navbar-generate" onClick={openModal}>
          Generar quiz
        </button>
        <button className="navbar-generate fixed-token-button" onClick={openTokensModal}>
          Tokens activos
        </button>
        <button className="bottom-left-button" onClick={toggleProfessorModal}>
          Agregar profesor
        </button>
      </div>
  
      {isProfessorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="card__title">{isProfessorSection ? 'Agregar Profesor' : 'Agregar Estudiante'}</span>
            <p className="card__content">
              {isProfessorSection ? 'Completa el formulario para agregar un nuevo profesor.' : 'Completa el formulario para agregar un nuevo estudiante.'}
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
                <div style={{ color: '#fff', backgroundColor: '#ff4d4d', padding: '10px', borderRadius: '5px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>⚠️</span>
                  <p>{errorMessage}</p>
                </div>
              )}
  
              {successMessage && (
                <div style={{ color: '#fff', backgroundColor: '#4CAF50', padding: '10px', borderRadius: '5px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>✔️</span>
                  <p>{successMessage}</p>
                </div>
              )}
  
              <button className="sign-up" onClick={isProfessorSection ? handleRegisterProfessor : handleRegisterGrupo}>
                Registrar
              </button>
            </div>
            <button className="modal-close" onClick={closeProfessorModal}>Cerrar</button>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <button onClick={toggleSection} style={{ padding: '5px 10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
                {isProfessorSection ? 'Cambiar a Asignar' : 'Cambiar a Añadir'}
              </button>
            </div>
          </div>
        </div>
      )}
  
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
            <button className="modal-close" onClick={closeTokensModal}>Cerrar</button>
          </div>
        </div>
      )}
  
  <div className="main-content1">
  <h2 className="group-title1">{selectedGroup}</h2>
  <div className="students-list1">
    {professorsWithGroups.length > 0 ? (
      professorsWithGroups.map((professor) => (
        <div key={professor.profesor_id} className="professor-group1">
          <p className="professor-name1"><strong>{professor.profesor_nombre}</strong></p>
          <div className="groups-container1">
            <p><strong>Grupos asignados:</strong></p>
            <div className="group-boxes1">
              {professor.grupos_asignados.map((group, index) => (
                <div key={index} className="group-box1">
                  {group}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No se encontraron profesores.</p>
    )}
  </div>
</div>

    </div>
  );

  
};
export default Tutor;
