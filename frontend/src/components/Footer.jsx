import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} FIAP Tech Challenge - EduBlog API & Front-End</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
          Plataforma educacional para docentes e alunos da rede pública de ensino.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
