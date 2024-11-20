import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './tutor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

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
  const [isProfessorSection, setIsProfessorSection] = useState(true);
  const [professors, setProfessors] = useState([]); // Lista de profesores
  const [newStudent, setNewStudent] = useState({
    username: '',
    password: '',
    email: '',
    professorId: '', // ID del profesor seleccionado
    groupId: '', // ID del grupo seleccionado
  });

  
  


  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch('https://miformadeaprender-all.onrender.com/auth/buscar'); // Asegúrate de que la ruta sea correcta
        if (response.ok) {
          const data = await response.json();
          setGroups(data.grupos); // Aquí usamos 'setGroups' en lugar de 'setGrupos'
        } else {
          console.error('Error al obtener los grupos');
        }
      } catch (error) {
        console.error('Error de conexión al servidor', error);
      }
    };
  
    fetchGrupos();
  }, []); 

  const handleBuscar = (newGroup) => {
    setSelectedGroup(newGroup);
  };


  //Mostrar grupos en combo 
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch('https://miformadeaprender-all.onrender.com/auth/buscar');
        if (response.ok) {
          const data = await response.json();
          // Asegúrate de que la respuesta tiene la clave 'grupos' con el array de grupos
          setGroups(data.grupos); // Asignamos la respuesta de los grupos al estado
        } else {
          console.error('Error al obtener los grupos');
        }
      } catch (error) {
        console.error('Error de conexión al servidor', error);
      }
    };
  
    fetchGrupos();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const [newProfessor, setNewProfessor] = useState({
    username: '',
    password: '',
    email: '',
  });

  
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch('https://miformadeaprender-all.onrender.com/auth/getProfesores');
        const data = await response.json();
  
        if (response.ok) {
          setProfessors(data.professors); // Guardamos los profesores en el estado
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      }
    };
  
    fetchProfessors(); // Llamamos a la función cuando se monta el componente
  }, []);
  
  

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
      setSuccessMessage(''); // Limpiar mensaje de éxito
      return;
    }
  
    try {
      const response = await fetch('https://miformadeaprender-all.onrender.com/auth/registro-profesor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfessor),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccessMessage('Profesor registrado exitosamente.'); // Mensaje de éxito
        setErrorMessage(''); // Limpiar cualquier mensaje de error previo
        setNewProfessor({ username: '', password: '', email: '' }); // Limpiar el formulario
      } else {
        setErrorMessage(data.message || 'Error al registrar el profesor.');
        setSuccessMessage(''); // Limpiar mensaje de éxito
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setErrorMessage('Ocurrió un error al registrar el profesor.');
      setSuccessMessage(''); // Limpiar mensaje de éxito
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
        <button className="navbar-filter" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faFilter} /> Filtrar
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
           {groups.length > 0 ? (
  groups.map((group, index) => (
    <div key={index} onClick={() => handleGroupChange(group.grupo)}>
      {group.grupo}
    </div>
  ))
) : (
  <p>No se encontraron grupos</p>
)}

          </div>
        )}
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
            {/* Formulario para Profesor */}
            <input
              placeholder="Nombre del profesor"
              type="text"
              className="modal-input"
              value={newProfessor.username}
              onChange={(e) => setNewProfessor({ ...newProfessor, username: e.target.value })}
            />
            <input
              placeholder="Contraseña del profesor"
              type="password"
              className="modal-input"
              value={newProfessor.password}
              onChange={(e) => setNewProfessor({ ...newProfessor, password: e.target.value })}
            />
            <input
              placeholder="Correo del profesor"
              type="email"
              className="modal-input"
              value={newProfessor.email}
              onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
            />
          </>
        ) : (
          <>
        

            {/* Combo de Profesores */}
            <div>
  {/* Combo de Profesores */}
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
          {professor.username} {/* Aquí mostramos el nombre solo para que sea entendible para el usuario */}
        </option>
      ))
    ) : (
      <option value="">No hay profesores disponibles</option>
    )}
  </select>
</div>


<div>
  {/* Combo de Grupos */}
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
      <option key={index} value={group.id}> {/* Usa `group.id` en lugar de `group.grupo` */}
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

        {/* Mostrar el mensaje de error si existe */}
        {errorMessage && (
          <div style={{ color: '#fff', backgroundColor: '#ff4d4d', padding: '10px', borderRadius: '5px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Mostrar el mensaje de éxito si existe */}
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
      <button className="modal-close" onClick={closeProfessorModal}>
        Cerrar
      </button>

      {/* Botón para alternar entre formularios */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button onClick={toggleSection} style={{ padding: '5px 10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
          {isProfessorSection ? 'Cambiar a Estudiante' : 'Cambiar a Profesor'}
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
              <div className="student-name"><strong>Nombre: </strong>{student.username}</div>
              <div className="student-email"><strong>Correo: </strong>{student.email}</div>
              <div className="student-grupo"><strong>Grupo: </strong>{student.grupo}</div>
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
