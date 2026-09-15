import React, { useState, useEffect } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { Search, Sparkles, BookOpen, AlertCircle } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (query.trim()) {
        response = await api.get(
          `/posts/search?term=${encodeURIComponent(query.trim())}`,
        );
      } else {
        response = await api.get("/posts");
      }
      setPosts(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      setError(
        "Não foi possível carregar os posts do servidor. Verifique se o back-end está ativo.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div>
      <section className="hero-banner">
        <h1 className="hero-title">Conhecimento que Transforma</h1>
        <p className="hero-subtitle">
          Explore aulas, conteúdos e artigos publicados pelos nossos docentes
          para enriquecer seus estudos.
        </p>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar por título, autor, assunto ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <main>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#94a3b8",
            }}
          >
            <p>Carregando publicações...</p>
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
              maxWidth: "600px",
              margin: "2rem auto",
            }}
          >
            <AlertCircle size={32} style={{ marginBottom: "0.5rem" }} />
            <p>{error}</p>
            <button
              onClick={() => fetchPosts(searchTerm)}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "1rem" }}
            >
              Tentar Novamente
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              color: "#64748b",
            }}
          >
            <BookOpen
              size={48}
              style={{ opacity: 0.4, marginBottom: "1rem" }}
            />
            <h3>Nenhum post encontrado</h3>
            <p style={{ marginTop: "0.5rem" }}>
              {searchTerm
                ? `Nenhum resultado corresponde à busca "${searchTerm}".`
                : "Nenhuma postagem disponível no momento."}
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
