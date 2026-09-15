import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} FIAP Tech Challenge - EduBlog</p>
      </div>
    </footer>
  );
};

export default Footer;
