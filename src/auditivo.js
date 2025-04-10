import React from "react";
import "./auditivo.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Auditivo = () => {
  return (
    <div className="learning-visual-container">
      <h1 className="title">Mejora tu Estilo de Aprendizaje Auditivo</h1>
      <p className="description">
      El aprendizaje auditivo se enfoca en escuchar información, como audios, podcasts y explicaciones verbales, para comprender y retener conocimientos.
      </p>

      <div className="resources-section">
        {}
        <div className="resource">
          <h2 className="resource-title">Videos Recomendados</h2>
          <div className="videos-container">
          <iframe width="1200" height="600" 
          src="https://www.youtube.com/embed/ZVivVg4fV98?si=oFPz5uVFSQE8AFS0" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
          </iframe>
          <iframe width="1200" height="600" 
          src="https://www.youtube.com/embed/3F5ELulLrAg?si=OXm9SsIhXUE920hL" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
          </iframe>
          </div>
        </div>

        {}
        <div className="resource">
          <h2 className="resource-title">Documentos Útiles</h2>
          <ul className="documents-list">
            <li>
              <a
                href="https://example.com/learning-visual-doc1.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Guía de Aprendizaje Visual - PDF
              </a>
            </li>
            <li>
              <a
                href="https://example.com/learning-visual-doc2.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ejercicios de Memoria Visual - PDF
              </a>
            </li>
          </ul>
        </div>

        {}
        <div className="resource">
          <h2 className="resource-title">Audios Educativos</h2>
          <div className="audio-container">
            <audio controls className="audio-player">
              <source src="https://example.com/audio1.mp3" type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <audio controls className="audio-player">
              <source src="https://example.com/audio2.mp3" type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>
      </div>
      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-12" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-56" />
      </div>
    </div>
  );
};

export default Auditivo;
