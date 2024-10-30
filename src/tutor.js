import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_morado.png';
import './tutor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

const Tutor = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState('Grupo IDGS10');
  const [students, setStudents] = useState([
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 1', email: 'alumno1@example.com', style: 'Visual' },
    { name: 'Alumno 2', email: 'alumno2@example.com', style: 'Auditivo' },
    { name: 'Alumno 20', email: 'alumno20@example.com', style: 'Kinestésico' },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(group);

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
    setGroup(newGroup); // Actualiza el grupo actual mostrado
    setDropdownOpen(false); // Cierra el dropdown después de seleccionar un grupo
  };

  return (
    <div className="tutor-container">
      {/* Navbar */}
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <input type="text" placeholder="Buscar..." className="navbar-search" />
        <button className="navbar-filter" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faFilter} /> Filtrar
        </button>
        {/* Dropdown para seleccionar grupo */}
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div onClick={() => handleGroupChange('Grupo IDGS10')}>Grupo IDGS10</div>
            <div onClick={() => handleGroupChange('Grupo IDGS20')}>Grupo IDGS20</div>
            <div onClick={() => handleGroupChange('Grupo IDGS30')}>Grupo IDGS30</div>
            {/* Agrega más opciones de grupos según sea necesario */}
          </div>
        )}
        <button className="navbar-generate">Generar quiz</button>
      </div>

      {/* Contenedor principal */}
      <div className="main-content">
        <h2 className="group-title">{selectedGroup}</h2>

        <div className="students-list">
          {students.map((student, index) => (
            <div key={index} className="student-row">
              <div className="student-name">{student.name}</div>
              <div className="student-email">{student.email}</div>
              <div className="student-style">{student.style}</div>
              <button className="details-button" onClick={() => handleDetailsClick(student)}>Detalles</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutor;
