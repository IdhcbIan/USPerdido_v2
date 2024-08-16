import React from 'react';
import { Link } from 'react-router-dom';
import './Legos.css'; 

const AnotherComponent = ({ closeSidebar }) => {
  return (
    <div className="sidebar">
      <h2>Informacoes!!</h2>
      <p>Somos um Projeto de Alunos Para Alunos!!</p>
      <li><Link to="/OurCom">Nossos Tutores</Link></li>
      <li><Link to="/Communities">Nossas Comunidades</Link></li>
      <li><Link to="/About">Sobre o Projeto</Link></li>
    </div>
  );
};

export default AnotherComponent;

