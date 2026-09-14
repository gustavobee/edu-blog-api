import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, User, Calendar, MessageSquare, Send, BookOpen } from 'lucide-react';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funcionalidade opcional de comentários (armazenados localmente)
  const [comments, setComments] = useState([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);

        // Carregar comentários do localStorage para este post especificamente
        const savedComments = localStorage.getItem(`comments_post_${id}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        }
      } catch (err) {
        console.error('Erro ao buscar post:', err);
        setError('Não foi possível carregar a postagem selecionada.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: newCommentAuthor.trim() || 'Estudante',
      text: newCommentText.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };

    const updatedComments = [commentObj, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_post_${id}`, JSON.stringify(updatedComments));
    setNewCommentText('');
    setNewCommentAuthor('');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
        <p>Carregando conteúdo da aula...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Ops! Ocorreu um problema.</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error || 'Postagem não encontrada.'}</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Data não informada';

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        Voltar para a Lista
      </Link>

      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {post.subject && <span className="badge badge-subject">{post.subject}</span>}
          {post.contentType && <span className="badge badge-subject" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}>{post.contentType}</span>}
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: '#f8fafc' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} />
            <span>Por <strong>{post.author || 'Docente'}</strong></span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {post.description && (
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid #6366f1', padding: '1.25rem 1.5rem', borderRadius: '0 12px 12px 0', fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '2rem', fontStyle: 'italic' }}>
          {post.description}
        </div>
      )}

      <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#e2e8f0', background: 'var(--bg-card)', padding: '2rem', borderRadius: '18px', border: '1px solid var(--border-color)', marginBottom: '3rem', whitespace: 'pre-line' }}>
        {post.content}
      </div>

      {/* Seção Opcional de Comentários */}
      <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} style={{ color: '#6366f1' }} />
          Comentários ({comments.length})
        </h3>

        <form onSubmit={handleAddComment} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Seu nome (ex: Aluno João)"
              value={newCommentAuthor}
              onChange={(e) => setNewCommentAuthor(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <textarea 
              className="form-textarea" 
              style={{ minHeight: '80px' }}
              placeholder="Escreva sua dúvida ou comentário sobre este conteúdo..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            <Send size={14} />
            Enviar Comentário
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#a5b4fc' }}>{c.author}</strong>
                  <span style={{ color: '#64748b' }}>{c.createdAt}</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{c.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
};

export default PostDetails;
