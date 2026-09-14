import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PostForm from './pages/PostForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              {/* Rotas Públicas (Visão de Alunos e Visitantes) */}
              <Route path="/" element={<Home />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas Protegidas (Visão e Gestão de Docentes) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/posts/novo" 
                element={
                  <ProtectedRoute>
                    <PostForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/posts/editar/:id" 
                element={
                  <ProtectedRoute>
                    <PostForm />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
