import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe um token armazenado ao carregar a aplicação
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_info');

    if (token === 'simulated_token') {
      setIsAuthenticated(true);
      setUser(savedUser ? JSON.parse(savedUser) : { name: 'Docente EduBlog', role: 'Professor' });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulação de Login conforme especificação do Back-End
    // O backend aceita 'simulated_token' no header 'access_token' para dar privilégios de Professor
    const simulatedUser = {
      email: email || 'professor@fiap.com.br',
      name: email ? email.split('@')[0] : 'Professor(a)',
      role: 'Docente'
    };

    localStorage.setItem('access_token', 'simulated_token');
    localStorage.setItem('user_info', JSON.stringify(simulatedUser));
    
    setIsAuthenticated(true);
    setUser(simulatedUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
