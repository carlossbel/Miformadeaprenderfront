import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './resultado.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Resultado = () => {
    const navigate = useNavigate();
    const resultados = useMemo(() => [
        { estilo: "Visual", porcentaje: 40 },
        { estilo: "Auditivo", porcentaje: 25 },
        { estilo: "Kinestésico", porcentaje: 35 }
    ], []);

    const handleBackClick = () => {
        navigate('/'); 
      };

    const [progress, setProgress] = useState(resultados.map(() => 0));

    useMemo(() => {
        const intervalIds = resultados.map((resultado, index) => {
            return setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = [...prevProgress];
                    if (newProgress[index] < resultado.porcentaje) {
                        newProgress[index] += 1;
                    } else {
                        clearInterval(intervalIds[index]);
                    }
                    return newProgress;
                });
            }, 1);
        });

        return () => intervalIds.forEach((id) => clearInterval(id));
    }, [resultados]);

    const pMin = resultados.reduce((min, item) =>
        item.porcentaje < min.porcentaje ? item : min
    );

    let x;
    switch(pMin.estilo) {
        case 'Kinestésico':
            x = 'https://www.ejemploKinestesico.com';
            break;
        case 'Auditivo':
            x = 'https://www.ejemploAuditivo.com';
            break;
        case 'Visual':
            x = 'https://www.ejemploVisual.com';
            break;
        default:
            x = 'https://www.nohaylink.com';
            break;
    }

    return (
        <div className="resultado-contenedor">
            <h1 className="resultado-titulo">Resultados del Cuestionario de Estilos de Aprendizaje</h1>
            <p className="resultado-descripcion">A continuación, se muestra el porcentaje de afinidad con cada estilo de aprendizaje:</p>
            <div className="resultado-lista">
                {resultados.map((resultado, index) => (
                    <div key={index} className="resultado-item">
                        <h2>{resultado.estilo}</h2>
                        <div className="barra-contenedor">
                            <div
                                className="barra-progreso"
                                style={{ width: `${progress[index]}%` }}
                            ></div>
                        </div>
                        <p className="porcentaje">{progress[index]}%</p>
                    </div>
                ))}
                <p>
                    Para mejorar tu rendimiento en el área de <b>{pMin.estilo}</b>, te recomendamos revisar la siguiente información.
                    <br/>
                    <a className='vinculo' href={x} target="_blank" rel="noopener noreferrer">Visitar Ejemplo</a>
                </p>
            </div>
            <button className="cta" onClick={handleBackClick}>
                <span>Regresar al Inicio</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
                </button>

                <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-6" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-7" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-8" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-9" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-10" />
      </div>
        </div>
    );
};

export default Resultado;