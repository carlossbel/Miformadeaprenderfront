import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './profesor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter } from '@fortawesome/free-solid-svg-icons';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const Profesor = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponsesModalOpen, setIsResponsesModalOpen] = useState(false); // Nueva variable para la modal de respuestas
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [responsesData, setResponsesData] = useState(null); // Datos de respuestas
  const [dropdownOpen, setDropdownOpen] = useState(false);
 const [groupStats, setGroupStats] = useState({
  visual: 0,
  auditivo: 0,
  kinestesico: 0,
});

const userId = localStorage.getItem('userId');
console.log('ID del usuario:', userId);


const [isStatsModalOpen, setIsStatsModalOpen] = useState(false); // Modal de estadísticas


useEffect(() => {
  const fetchGrupos = async () => {
    const userId = localStorage.getItem('userId'); // Obtén el ID del usuario del localStorage
    console.log('ID del usuario:', userId);

    if (!userId) {
      console.error('No se encontró el ID del usuario en localStorage');
      return;
    }

    try {
      // Modifica la URL para incluir el ID del profesor
      const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/buscar/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Grupos asociados:', data.grupos); // Para depuración
        setGroups(data.grupos); // Actualiza el estado con los grupos
      } else {
        console.error('Error al obtener los grupos');
      }
    } catch (error) {
      console.error('Error de conexión al servidor', error);
    }
  };

  fetchGrupos(); // Llama a la función cuando se monta el componente
}, []);

  

  

  const handleGroupChange = async (group) => {
    setSelectedGroup(group);
    setDropdownOpen(false);
  
    // Obtener el ID del profesor desde localStorage
    const userId = localStorage.getItem('userId');
    console.log('userId:', userId);
    console.log('selectedGroup:', group);  // Usa el grupo pasado como argumento directamente
    
    if (!userId) {
      console.error('No se encontró el ID del profesor');
      return;
    }
  
    try {
      // Realiza la solicitud pasando tanto el ID del profesor como el grupo
      const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/buscar/${userId}/${group}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta de la API:', data);  // Verifica la respuesta
        if (data.usuarios && data.usuarios.length > 0) {
          setStudents(data.usuarios.map((usuario) => ({
            username: usuario.username,
            email: usuario.email,
            grupo: usuario.grupo,
            id: usuario.id,
            estilo_dominante: usuario.estilo_dominante,
          })));
        } else {
          console.error(`No se encontraron usuarios en el grupo ${group}`);
        }
      } else {
        console.error(`Error al obtener los usuarios en el grupo ${group}`);
      }
    } catch (error) {
      console.error('Error de conexión al servidor', error);
    }
  };
  

  
  

  //Grafica
  const handleShowGroupStats = async (group) => {
    setSelectedGroup(group);
    if (!group) {
      console.error('No se ha seleccionado un grupo');
      return;
    }
  
    try {
      // Asegúrate de que el valor pasado sea un string y no un objeto
      const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/grafica/${group}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Estadísticas del grupo:', data);
  
        setGroupStats({
          visual: parseFloat(data.visual),
          auditivo: parseFloat(data.auditivo),
          kinestesico: parseFloat(data.kinestesico),
        });
  
        setIsStatsModalOpen(true); // Abre la modal de estadísticas
      } else {
        console.error('Error al obtener las estadísticas del grupo');
        setGroupStats(null);
      }
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setGroupStats(null);
    }
  };



  
    // Función para manejar el cierre de sesión
    const handleLogout = () => {
      // Eliminar el ID del usuario del localStorage
      localStorage.removeItem('userId');
  
      // Redirigir al usuario a la página de inicio de sesión
      navigate('/');
    };
  
  
  

  const handleRespuestas = async (id_user) => {
    try {
      // Llama a la API para obtener las respuestas del usuario
      const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/getRespuestas/${id_user}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          // Si hay respuestas, actualiza el estado para mostrar en la modal de respuestas
          setResponsesData(data);
          setIsModalOpen(false); // Cierra la modal actual
          setIsResponsesModalOpen(true); // Abre la modal de respuestas
        } else {
          console.error('No se encontraron respuestas para este usuario');
          setResponsesData(null);
        }
      } else {
        console.error('Error al obtener las respuestas del usuario');
        setResponsesData(null);
      }
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setResponsesData(null);
    }
  };

  const handleDetailsClick = async (student) => {
    if (!student.id) {
      console.error('ID del estudiante no encontrado');
      return;
    }

    setSelectedStudent(student);
    setIsModalOpen(true);

    try {
      const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/getResultadosTutor/${student.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Detalles del estudiante:', data);

        if (Array.isArray(data) && data.length > 0) {
          setModalData(data);
        } else {
          setModalData(null);
        }
      } else {
        setModalData(null);
      }
    } catch (error) {
      console.error('Error de conexión al servidor', error);
      setModalData(null);
    }
  };

  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setModalData(null);
  };

  const closeResponsesModal = () => {
    setIsResponsesModalOpen(false);
    setResponsesData(null);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="tutor-container">
      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-66" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-77" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-88" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-99" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-100" />
      </div>

      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <input type="text" placeholder="Buscar..." className="navbar-search" />
        <button className="navbar-filter1" onClick={toggleDropdown}>
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
        <button className="navbar-generate" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="main-content">
        <h2 className="group-title">{selectedGroup}</h2>
        <div className="students-list">
          {students.map((student, index) => (
            <div key={index} className="student-row">
              <div className="student-name"><strong>Nombre:</strong> {student.username}</div>
              <div className="student-email"><strong>Correo:</strong> {student.email}</div>
              <div className="student-grupo"><strong>Grupo:</strong> {student.grupo}</div>
              <div className="student-estilo"><strong>Estilo:</strong> {student.estilo_dominante}</div>
              <button className="details-button" onClick={() => handleDetailsClick(student)}>
                Detalles
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="navbar-stats1" onClick={() => handleShowGroupStats(selectedGroup)}>
  Estadísticas
</button>

{isStatsModalOpen && groupStats && (
  <div className="modal">
    <div className="modal-content-detalles">
      {/* Asegúrate de que estás pasando un valor adecuado a JSX, no un objeto */}
      <h2>Estadísticas del Grupo: {selectedGroup}</h2>

      {/* Solo pasa números a los datos del gráfico */}
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
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
                  size: 20, // Tamaño de la fuente de las etiquetas en la leyenda
                  family: 'Arial', // Tipo de fuente
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
        height={400} // Ajusta el alto a lo que necesites
  width={500}
      />
      
      <button onClick={() => setIsStatsModalOpen(false)}>Cerrar</button>
    </div>
  </div>
)}

      {/* Modal de detalles del usuario */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content-detalles">
            <h2>Detalles del Usuario</h2>
            {modalData ? (
              Array.isArray(modalData) ? (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID de la pregunta</th>
                        <th>Predicción Visual</th>
                        <th>Predicción Auditiva</th>
                        <th>Predicción Kinestésica</th>
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
                          <td>{studentData.fecha ? new Date(studentData.fecha).toLocaleString() : 'No disponible'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Los datos no están disponibles o no son válidos.</p>
              )
            ) : (
              <p>Cargando datos...</p>
            )}
            <button onClick={closeModal}>Cerrar</button>
            <button className="details-button1" onClick={() => handleRespuestas(selectedStudent.id)}>Respuestas</button>
          </div>
        </div>
      )}

      {/* Modal de respuestas */}
      {/* Modal de respuestas */}
{isResponsesModalOpen && (
  <div className="modal">
    <div className="modal-content-detalles">
      <h2>Respuestas del Usuario</h2>
      {responsesData ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID de la Pregunta</th>
                <th>Respuesta</th>
                <th>Estilo</th>
                <th>Valor de la Respuesta</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {responsesData.map((response, index) => (
                <tr key={index}>
                  <td>{response.id}</td>
                  <td>{response.pregunta_id}</td>
                  <td>{response.respuesta}</td>
                  <td>{response.estilo}</td>
                  <td>{response.respuestaValor}</td>
                  <td>{new Date(response.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron respuestas.</p>
      )}
      <button onClick={closeResponsesModal}>Cerrar</button>
      {/* Botón para volver a la modal de resultados */}
      <button className="details-button2"  onClick={() => { closeResponsesModal(); setIsModalOpen(true); }}>Volver a Resultados</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Profesor;
