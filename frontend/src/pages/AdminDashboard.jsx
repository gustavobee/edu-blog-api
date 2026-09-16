import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import {
  PlusCircle,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");

  const fetchAdminPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Como o interceptor injeta o access_token: simulated_token,
      // esta rota retornará TODOS os posts (incluindo rascunhos)
      const response = await api.get("/posts");
      setPosts(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar posts para admin:", err);
      setError(
        "Falha ao carregar a lista de administração. Verifique sua autenticação.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPosts();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza de que deseja excluir esta postagem? Esta ação não pode ser desfeita.",
      )
    ) {
      try {
        await api.delete(`/posts/${id}`);
        setPosts(posts.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Erro ao excluir post:", err);
        alert("Erro ao excluir postagem do servidor.");
      }
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filterStatus === "todos") return true;
    return p.status === filterStatus;
  });

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-info">
          <h1 className="admin-title">
            Painel Administrativo do Docente
          </h1>
          <p className="admin-subtitle">
            Gerencie o ciclo de vida completo de aulas, artigos e rascunhos.
          </p>
        </div>

        <div className="admin-actions">
          <button
            onClick={fetchAdminPosts}
            className="btn btn-secondary btn-sm"
            title="Atualizar lista"
          >
            <RefreshCw size={16} />
            <span>Atualizar</span>
          </button>
          <Link to="/admin/posts/novo" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Nova Postagem</span>
          </Link>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-label">
          <Filter size={16} style={{ color: "#64748b" }} />
          <span>Filtrar por Status:</span>
        </div>
        <div className="admin-filter-buttons">
          <button
            onClick={() => setFilterStatus("todos")}
            className={`btn btn-sm ${filterStatus === "todos" ? "btn-primary" : "btn-secondary"}`}
          >
            Todos ({posts.length})
          </button>
          <button
            onClick={() => setFilterStatus("publicado")}
            className={`btn btn-sm ${filterStatus === "publicado" ? "btn-primary" : "btn-secondary"}`}
          >
            Publicados ({posts.filter((p) => p.status === "publicado").length})
          </button>
          <button
            onClick={() => setFilterStatus("rascunho")}
            className={`btn btn-sm ${filterStatus === "rascunho" ? "btn-primary" : "btn-secondary"}`}
          >
            Rascunhos ({posts.filter((p) => p.status === "rascunho").length})
          </button>
          <button
            onClick={() => setFilterStatus("arquivado")}
            className={`btn btn-sm ${filterStatus === "arquivado" ? "btn-primary" : "btn-secondary"}`}
          >
            Arquivados ({posts.filter((p) => p.status === "arquivado").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            color: "#94a3b8",
          }}
        >
          <p>Carregando gerenciador de conteúdos...</p>
        </div>
      ) : error ? (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
            color: "#fca5a5",
          }}
        >
          <AlertCircle size={32} style={{ marginBottom: "0.5rem" }} />
          <p>{error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            color: "#64748b",
          }}
        >
          <h3>Nenhuma postagem encontrada</h3>
          <p style={{ marginTop: "0.5rem" }}>
            Clique em "Nova Postagem" acima para criar sua primeira aula!
          </p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isAdmin={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
