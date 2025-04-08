import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './profesor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter, faChartPie } from '@fortawesome/free-solid-svg-icons';
import alertService from './alertService';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Profesor = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponsesModalOpen, setIsResponsesModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [responsesData, setResponsesData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [groupStats, setGroupStats] = useState({
    visual: 0,
    auditivo: 0,
    kinestesico: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // URL de API con respaldo
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';

  const userId = localStorage.getItem('userId');
  console.log('ID del usuario profesor:', userId);

  // Cargar los grupos al iniciar
  useEffect(() => {
    const fetchGroups = async () => {
      if (!userId) {
        console.error('No se encontró el ID del usuario en localStorage');
        alertService.error('Sesión no encontrada. Por favor, inicia sesión nuevamente.');
        navigate('/'); // Redirigir si no hay ID
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/auth/buscar/${userId}`);
        
        if (!response.ok && response.status !== 404) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Respuesta de grupos:', data);
        
        if (data.grupos && Array.isArray(data.grupos)) {
          setGroups(data.grupos);
          
          // Seleccionar automáticamente el primer grupo y cargar sus estudiantes
          if (data.grupos.length > 0) {
            const firstGroup = data.grupos[0].grupo;
            setSelectedGroup(firstGroup);
            fetchStudentsByGroup(firstGroup);
            alertService.info(`Grupo "${firstGroup}" seleccionado automáticamente`);
          } else {
            alertService.warning('No tienes grupos asignados. Contacta al administrador.');
          }
        } else {
          setGroups([]);
          console.log('No se encontraron grupos o el formato de respuesta es incorrecto');
          alertService.warning('No se encontraron grupos asignados');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
        setGroups([]);
        setIsLoading(false);
        setError('Error al cargar los grupos. Por favor, intenta nuevamente.');
        alertService.error('Error al cargar los grupos. Por favor, intenta nuevamente.');
      }
    };

    fetchGroups();
  }, [userId, navigate, API_URL]);

  // Función para cargar estudiantes de un grupo específico
  const fetchStudentsByGroup = async (group) => {
    if (!userId || !group) {
      console.error('Falta ID del profesor o nombre del grupo');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/buscar/${userId}/${group}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener estudiantes: ${response.status}`);
      }

      const data = await response.json();
      console.log('Estudiantes del grupo:', data);
      
      if (data.usuarios && data.usuarios.length > 0) {
        setStudents(data.usuarios.map((usuario) => ({
          username: usuario.username,
          email: usuario.email,
          grupo: usuario.grupo,
          id: usuario.id,
          estilo_dominante: usuario.estilo_dominante,
        })));
        alertService.success(`${data.usuarios.length} estudiantes encontrados en el grupo "${group}"`);
      } else {
        setStudents([]);
        console.log(`No se encontraron usuarios en el grupo ${group}`);
        alertService.info(`No se encontraron estudiantes en el grupo "${group}"`);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setStudents([]);
      setIsLoading(false);
      setError('Error al cargar los estudiantes. Por favor, intenta nuevamente.');
      alertService.error('Error al cargar los estudiantes');
    }
  };

  // Manejo de cambio de grupo
  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setDropdownOpen(false);
    alertService.info(`Cambiando al grupo "${group}"`);
    fetchStudentsByGroup(group);
  };

  // Obtener estadísticas del grupo
  const handleShowGroupStats = async (group) => {
    if (!group) {
      alertService.warning('Por favor, selecciona un grupo primero');
      console.error('No se ha seleccionado un grupo');
      return;
    }
  
    try {
      setIsLoading(true);
      alertService.info(`Cargando estadísticas del grupo "${group}"...`);
      const response = await fetch(`${API_URL}/auth/grafica/${group}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Estadísticas del grupo:', data);
  
      setGroupStats({
        visual: parseFloat(data.visual) || 0,
        auditivo: parseFloat(data.auditivo) || 0,
        kinestesico: parseFloat(data.kinestesico) || 0,
      });
  
      setIsStatsModalOpen(true);
      setIsLoading(false);
      alertService.success('Estadísticas cargadas correctamente');
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setGroupStats({ visual: 0, auditivo: 0, kinestesico: 0 });
      setIsLoading(false);
      setError('Error al cargar las estadísticas. Por favor, intenta nuevamente.');
      alertService.error('Error al cargar estadísticas del grupo');
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    alertService.info('Cerrando sesión...');
    localStorage.removeItem('userId');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Obtener respuestas de un estudiante
  const handleRespuestas = async (id_user) => {
    try {
      setIsLoading(true);
      alertService.info('Cargando respuestas del estudiante...');
      const response = await fetch(`${API_URL}/auth/getRespuestas/${id_user}`);

      if (!response.ok) {
        throw new Error(`Error al obtener respuestas: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuestas del estudiante:', data);
      
      if (data && data.length > 0) {
        setResponsesData(data);
        setIsModalOpen(false);
        setIsResponsesModalOpen(true);
        alertService.success(`${data.length} respuestas encontradas`);
      } else {
        setResponsesData([]);
        console.error('No se encontraron respuestas para este usuario');
        alertService.warning('No se encontraron respuestas para este estudiante');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setResponsesData(null);
      setIsLoading(false);
      setError('Error al cargar las respuestas. Por favor, intenta nuevamente.');
      alertService.error('Error al cargar las respuestas');
    }
  };

  // Obtener detalles de un estudiante
  const handleDetailsClick = async (student) => {
    if (!student.id) {
      console.error('ID del estudiante no encontrado');
      alertService.error('No se pudo identificar al estudiante');
      return;
    }

    setSelectedStudent(student);
    setIsModalOpen(true);
    setIsLoading(true);
    alertService.info(`Cargando detalles de ${student.username}...`);

    try {
      const response = await fetch(`${API_URL}/auth/getResultadosTutor/${student.id}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener detalles: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Detalles del estudiante:', data);

      if (Array.isArray(data) && data.length > 0) {
        setModalData(data);
        alertService.success('Detalles cargados correctamente');
      } else {
        setModalData([]);
        alertService.warning('No hay resultados disponibles para este estudiante');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setModalData(null);
      setIsLoading(false);
      setError('Error al cargar los detalles. Por favor, intenta nuevamente.');
      alertService.error('Error al cargar los detalles del estudiante');
    }
  };

  // Funciones para cerrar modales
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setModalData(null);
    alertService.info('Panel cerrado');
  };

  const closeResponsesModal = () => {
    setIsResponsesModalOpen(false);
    setResponsesData(null);
    alertService.info('Panel de respuestas cerrado');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Renderizado de componente de carga
  if (isLoading && !students.length && !groups.length) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando datos...</p>
        <div className="stars-container">
          {Array.from({ length: 50 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className="star-icon"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${0.5 + Math.random() * 1.5}rem`,
                opacity: 0.1 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-container">
      <div className="stars-container">
        {Array.from({ length: 50 }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className="star-icon"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${0.5 + Math.random() * 1.5}rem`,
              opacity: 0.1 + Math.random() * 0.5
            }}
          />
        ))}
      </div>

      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <input 
          type="text" 
          placeholder="Buscar estudiante..." 
          className="navbar-search"
          onChange={(e) => {
            if (e.target.value.length > 2) {
              alertService.info(`Buscando "${e.target.value}"...`);
            }
          }}
        />
        <button className="navbar-filter1" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faFilter} /> Filtrar por grupo
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
        <button className="navbar-generate" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="main-content">
        <h2 className="group-title">{selectedGroup || "Selecciona un grupo"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="students-list">
          {students.length > 0 ? (
            students.map((student, index) => (
              <div key={index} className="student-row">
                <div className="student-name"><strong>Nombre:</strong> {student.username}</div>
                <div className="student-email"><strong>Correo:</strong> {student.email}</div>
                <div className="student-grupo"><strong>Grupo:</strong> {student.grupo}</div>
                <div className="student-estilo"><strong>Estilo:</strong> {student.estilo_dominante || 'No determinado'}</div>
                <button className="details-button" onClick={() => handleDetailsClick(student)}>
                  Detalles
                </button>
              </div>
            ))
          ) : (
            <div className="no-students">
              {selectedGroup ? 
                "No se encontraron estudiantes en este grupo" : 
                "Selecciona un grupo para ver sus estudiantes"
              }
            </div>
          )}
        </div>
      </div>

      <button className="navbar-stats1" onClick={() => handleShowGroupStats(selectedGroup)}>
        <FontAwesomeIcon icon={faChartPie} /> Estadísticas del grupo
      </button>

      {/* Modal de estadísticas */}
      {isStatsModalOpen && groupStats && (
        <div className="modal">
          <div className="modal-content-detalles">
            <h2>Estadísticas del Grupo: {selectedGroup}</h2>

            <div className="chart-container">
              <Pie
                data={{
                  labels: ['Visual', 'Auditivo', 'Kinestésico'],
                  datasets: [
                    {
                      label: 'Porcentaje',
                      data: [
                        groupStats.visual,
                        groupStats.auditivo,
                        groupStats.kinestesico,
                      ],
                      backgroundColor: ['#4264b2', '#809de1', '#a3baed'],
                      hoverBackgroundColor: ['#3050a0', '#6080c0', '#90a0d0'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        font: {
                          size: 16,
                          family: 'Arial',
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: ${context.raw}%`;
                        },
                      },
                    },
                  },
                }}
                height={400}
                width={500}
              />
            </div>
            
            <div className="stat-summary">
              <div className="stat-item">
                <h3>Visual</h3>
                <p>{parseFloat(groupStats.visual).toFixed(1)}%</p>
              </div>
              <div className="stat-item">
                <h3>Auditivo</h3>
                <p>{parseFloat(groupStats.auditivo).toFixed(1)}%</p>
              </div>
              <div className="stat-item">
                <h3>Kinestésico</h3>
                <p>{parseFloat(groupStats.kinestesico).toFixed(1)}%</p>
              </div>
            </div>
            
            <button 
              className="modal-close-btn" 
              onClick={() => {
                setIsStatsModalOpen(false);
                alertService.info('Estadísticas cerradas');
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de detalles del estudiante */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content-detalles">
            <h2>Detalles del Usuario: {selectedStudent?.username}</h2>
            
            {isLoading ? (
              <div className="modal-loading">
                <div className="loader"></div>
                <p>Cargando datos...</p>
              </div>
            ) : (
              modalData ? (
                Array.isArray(modalData) ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Visual (%)</th>
                          <th>Auditivo (%)</th>
                          <th>Kinestésico (%)</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modalData.map((studentData, index) => (
                          <tr key={index}>
                            <td>{studentData.id}</td>
                            <td>{studentData.visual_predicho || 'No disponible'}</td>
                            <td>{studentData.auditivo_predicho || 'No disponible'}</td>
                            <td>{studentData.kinestesico_predicho || 'No disponible'}</td>
                            <td>{studentData.created_at ? new Date(studentData.created_at.seconds * 1000).toLocaleString() : 'No disponible'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Los datos no están disponibles o no son válidos.</p>
                )
              ) : (
                <p>No hay resultados disponibles para este estudiante.</p>
              )
            )}
            
            <div className="modal-actions">
              <button className="modal-close-btn" onClick={closeModal}>Cerrar</button>
              <button className="details-button1" onClick={() => handleRespuestas(selectedStudent?.id)}>
                Ver Respuestas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de respuestas */}
      {isResponsesModalOpen && (
        <div className="modal">
          <div className="modal-content-detalles">
            <h2>Respuestas de {selectedStudent?.username}</h2>
            
            {isLoading ? (
              <div className="modal-loading">
                <div className="loader"></div>
                <p>Cargando respuestas...</p>
              </div>
            ) : (
              responsesData && responsesData.length > 0 ? (
                <div className="respuestas-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                        <th>Estilo</th>
                        <th>Valor</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responsesData.map((response, index) => (
                        <tr key={index}>
                          <td>{response.pregunta_id}</td>
                          <td>{response.respuesta}</td>
                          <td>{response.estilo}</td>
                          <td>{response.respuestaValor}</td>
                          <td>{response.created_at ? new Date(response.created_at.seconds * 1000).toLocaleString() : 'No disponible'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No se encontraron respuestas para este estudiante.</p>
              )
            )}
            
            <div className="modal-actions">
              <button className="modal-close-btn" onClick={closeResponsesModal}>Cerrar</button>
              <button className="details-button2" onClick={() => { 
                closeResponsesModal(); 
                setIsModalOpen(true); 
              }}>
                Volver a Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profesor;