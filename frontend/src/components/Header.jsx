import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, LogIn, LogOut, ShieldCheck, Home, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-brand">
          <BookOpen size={28} style={{ color: '#6366f1' }} />
          <span>EduBlog</span>
        </Link>

        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Início</span>
          </Link>

          {isAuthenticated && (
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Painel Admin</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="user-badge">
                <ShieldCheck size={16} />
                <span>{user?.name || 'Professor'}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Encerrar sessão de docente"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={16} />
              <span>Área do Professor</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
