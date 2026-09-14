import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const PostForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    content: '',
    status: 'publicado',
    subject: 'Programação',
    contentType: 'Aula'
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPostToEdit = async () => {
        try {
          const response = await api.get(`/posts/${id}`);
          const data = response.data;
          setFormData({
            title: data.title || '',
            author: data.author || '',
            description: data.description || '',
            content: data.content || '',
            status: data.status || 'publicado',
            subject: data.subject || 'Programação',
            contentType: data.contentType || 'Aula'
          });
        } catch (err) {
          console.error('Erro ao carregar dados do post:', err);
          setError('Não foi possível carregar a postagem para edição.');
        } finally {
          setLoading(false);
        }
      };
      fetchPostToEdit();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, formData);
      } else {
        await api.post('/posts', formData);
      }
      navigate('/admin');
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      setError(err.response?.data?.message || 'Erro ao salvar a postagem no servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
        <p>Carregando formulário...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        Voltar para o Painel
      </Link>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '2.5rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <FileText size={28} style={{ color: '#6366f1' }} />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {isEditing ? 'Editar Postagem' : 'Criar Nova Postagem'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Preencha os campos abaixo para disponibilizar o conteúdo para os estudantes.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título da Aula / Postagem *</label>
            <input 
              type="text"
              name="title"
              className="form-input"
              placeholder="Ex: Introdução à Algoritmos e Lógica de Programação"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nome do Autor / Professor *</label>
              <input 
                type="text"
                name="author"
                className="form-input"
                placeholder="Ex: Prof. Gustavo Bee"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Disciplina / Assunto</label>
              <select name="subject" className="form-select" value={formData.subject} onChange={handleChange}>
                <option value="Programação">Programação</option>
                <option value="Matemática">Matemática</option>
                <option value="História">História</option>
                <option value="Física">Física</option>
                <option value="Português">Português</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status de Publicação</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="publicado">Publicado (Visível para Alunos)</option>
                <option value="rascunho">Rascunho (Privado para Professores)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Conteúdo</label>
              <select name="contentType" className="form-select" value={formData.contentType} onChange={handleChange}>
                <option value="Aula">Aula</option>
                <option value="Artigo">Artigo</option>
                <option value="Exercício">Exercício</option>
                <option value="Aviso">Aviso</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Breve Descrição / Resumo</label>
            <input 
              type="text"
              name="description"
              className="form-input"
              placeholder="Resumo curto que aparecerá no card principal"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Conteúdo Completo *</label>
            <textarea 
              name="content"
              className="form-textarea"
              placeholder="Escreva a aula completa ou explicação detalhada aqui..."
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/admin" className="btn btn-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>{isEditing ? 'Salvar Alterações' : 'Publicar Postagem'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
