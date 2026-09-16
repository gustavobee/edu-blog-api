import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { formatSubject, formatContentType, formatStatus } from '../constants/postConstants';

const PostCard = ({ post, isAdmin = false, onDelete }) => {
  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Data recente';

  return (
    <article className="post-card">
      <div>
        <div className="post-meta">
          {post.subject && (
            <span className="badge badge-subject">{formatSubject(post.subject)}</span>
          )}
          {post.contentType && (
            <span className="badge badge-content-type">{formatContentType(post.contentType)}</span>
          )}
          {isAdmin && (
            <span className={`badge ${post.status === 'publicado' ? 'badge-status-published' : post.status === 'arquivado' ? 'badge-status-archived' : 'badge-status-draft'}`}>
              {formatStatus(post.status) || 'Rascunho'}
            </span>
          )}
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description || post.content?.substring(0, 120) + '...'}</p>
      </div>

      <div>
        <div className="post-author-row">
          <User size={14} />
          <span>{post.author || 'Docente EduBlog'}</span>
          <span style={{ margin: '0 0.25rem' }}>•</span>
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
          <Link to={`/posts/${post.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
            <span>Ler mais</span>
            <ArrowRight size={14} />
          </Link>

          {isAdmin && (
            <>
              <Link 
                to={`/admin/posts/editar/${post.id}`} 
                className="btn btn-secondary btn-sm" 
                title="Editar Post"
              >
                <Edit3 size={14} />
              </Link>
              <button 
                onClick={() => onDelete && onDelete(post.id)} 
                className="btn btn-danger btn-sm" 
                title="Excluir Post"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
