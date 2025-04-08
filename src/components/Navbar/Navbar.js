import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faFilter, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ 
  logo, 
  showSearch = true, 
  showFilter = false,
  onFilterClick,
  filterActive = false,
  actions = [],
  title = ''
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detectar scroll para cambiar estilos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implementar la lógica de búsqueda
    console.log('Búsqueda:', searchQuery);
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo y título */}
        <div className="navbar-brand">
          {logo && (
            <img src={logo} alt="Logo" className="navbar-logo" onClick={handleHomeClick} />
          )}
          {title && <h1 className="navbar-title">{title}</h1>}
        </div>
        
        {/* Búsqueda - Solo en desktop */}
        {showSearch && (
          <form className="navbar-search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar..."
              className="navbar-search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="navbar-search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        )}
        
        {/* Botones de acción - Desktop */}
        <div className="navbar-actions">
          {showFilter && (
            <button 
              className={`navbar-button ${filterActive ? 'active' : ''}`} 
              onClick={onFilterClick}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Filtrar</span>
            </button>
          )}
          
          {actions.map((action, index) => (
            <button 
              key={index}
              className="navbar-button"
              onClick={action.onClick}
            >
              {action.icon && <FontAwesomeIcon icon={action.icon} />}
              <span>{action.label}</span>
            </button>
          ))}
          
          <button className="navbar-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
        
        {/* Botón de menú móvil */}
        <button className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>
      
      {/* Menú móvil */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {showSearch && (
          <form className="navbar-mobile-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        )}
        
        <div className="navbar-mobile-actions">
          <button className="navbar-mobile-button" onClick={handleHomeClick}>
            <FontAwesomeIcon icon={faHome} />
            <span>Inicio</span>
          </button>
          
          {showFilter && (
            <button 
              className={`navbar-mobile-button ${filterActive ? 'active' : ''}`} 
              onClick={onFilterClick}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Filtrar</span>
            </button>
          )}
          
          {actions.map((action, index) => (
            <button 
              key={index}
              className="navbar-mobile-button"
              onClick={action.onClick}
            >
              {action.icon && <FontAwesomeIcon icon={action.icon} />}
              <span>{action.label}</span>
            </button>
          ))}
          
          <button className="navbar-mobile-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;