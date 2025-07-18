import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="sispe-footer">
    <div className="sispe-footer-container">
      <div className="sispe-footer-col">
        <h3 className="sispe-footer-title">SISPE</h3>
        <p className="sispe-footer-desc">Projeto desenvolvido com o objetivo de facilitar a identificação de pessoas em eventos e ambientes controlados.</p>
      </div>
      <div className="sispe-footer-col">
        <h4 className="sispe-footer-subtitle">Links Úteis</h4>
        <ul className="sispe-footer-list">
          <li><a href="https://salesportifolio.netlify.app/" target="_blank" rel="noopener noreferrer">Portfólio</a></li>
          <li><a href="https://github.com/Usales" target="_blank" rel="noopener noreferrer">Github</a></li>
          <li><a href="https://www.linkedin.com/in/gabriel-henriques-sales-43953b218/" target="_blank" rel="noopener noreferrer">Linkedin</a></li>
        </ul>
      </div>
      <div className="sispe-footer-col">
        <h4 className="sispe-footer-subtitle">Contato</h4>
        <ul className="sispe-footer-list">
          <li>Email: GabrielHenriqueslsales1@gmail.com</li>
          <li>Whatsapp: (62) 99522-7774</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer; 