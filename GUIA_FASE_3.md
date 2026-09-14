# 📘 Guia Didático de Desenvolvimento - Tech Challenge Fase 3 (EduBlog Front-End)

Este documento foi criado para registrar e explicar **passo a passo** a construção da interface gráfica (Front-End) da aplicação **EduBlog**, conectando-a à API REST em Node.js desenvolvida nas fases anteriores.

---

## 🎯 Objetivos da Fase 3
1. **Interface Gráfica com React**: Desenvolver uma aplicação moderna, responsiva e acessível em React.
2. **Segregação de Visões (Aluno vs. Professor)**:
   - **Aluno**: Visualizar listagem de posts públicos, realizar buscas por palavra-chave e ler o conteúdo completo das postagens.
   - **Professor (Autenticado)**: Acessar o painel administrativo (`/admin`) para Criar, Editar, Listar e Deletar postagens (CRUD completo), gerenciando também rascunhos e conteúdos privados.
3. **Autenticação Simulada**: Gerenciar o cabeçalho `access_token: simulated_token` exigido pelo backend via estado global (React Context API).
4. **Infraestrutura**: Orquestrar o serviço do Front-End junto ao Back-End e Banco de Dados com Docker Compose.

---

## 🗺️ Visão Geral do Plano de Ação

| Etapa | Descrição | Status |
| :--- | :--- | :---: |
| **Etapa 1** | **Setup Inicial**: Criação do projeto React com Vite e instalação das dependências (`react-router-dom`, `axios`, `styled-components`, `lucide-react`). | ✅ Concluído |
| **Etapa 2** | **Contexto de Autenticação & Layout Base**: `AuthContext` para login/logout e componentes globais (`Header` e `Footer`). | ✅ Concluído |
| **Etapa 3** | **Visão do Aluno - Home & Busca**: Página principal listando posts públicos com barra de pesquisa interativa. | ✅ Concluído |
| **Etapa 4** | **Visão do Aluno - Leitura do Post**: Página de leitura detalhada da aula/postagem e seção opcional de comentários. | ✅ Concluído |
| **Etapa 5** | **Tela de Login do Professor**: Formulário para autenticação simulada e armazenamento do token no `localStorage`. | ✅ Concluído |
| **Etapa 6** | **Painel Admin do Professor (CRUD)**: Páginas de listagem geral, formulário de criação e edição, exclusão e rotas protegidas (`ProtectedRoute`). | ✅ Concluído |
| **Etapa 7** | **Conteinerização & CI/CD**: Dockerfile multi-stage com NGINX, `docker-compose.yml` orquestrado e documentação técnica. | ✅ Concluído |

---

## 🧠 Conceitos e Aprendizados de Cada Etapa

### Etapa 1: Por que utilizar Vite + React?
- **Vite**: É uma ferramenta de build extremamente rápida que utiliza ES Modules nativos do navegador durante o desenvolvimento. Substituiu o antigo `create-react-app`.
- **Estrutura de Pastas Escolhida**:
  ```text
  tech-challenge/
  ├── src/                # Back-end Node.js / Express (Fase 2)
  ├── frontend/           # Front-end React (Fase 3)
  │   ├── src/
  │   │   ├── components/ # Header, Footer, PostCard, ProtectedRoute
  │   │   ├── contexts/   # AuthContext (Gerenciamento de Login)
  │   │   ├── pages/      # Home, PostDetails, Login, AdminDashboard, PostForm
  │   │   ├── services/   # api.js (Cliente Axios com Interceptor)
  │   │   ├── index.css   # Sistema de Design com Tema Escuro & Responsividade
  │   │   └── App.jsx     # Roteamento central com React Router
  │   ├── Dockerfile      # Build Multi-stage com NGINX
  │   └── nginx.conf      # Suporte a SPA (Single Page Application)
  ├── docker-compose.yml  # Orquestração (Database + API + Frontend)
  ```

---

### Etapa 2: Gerenciamento de Autenticação Simulada (`AuthContext`)
- **Desafio do Back-end**: O servidor exige que requisições administrativas (criar, editar e excluir posts) contenham o cabeçalho HTTP `access_token: simulated_token`.
- **Solução no Front-end**:
  1. O `AuthContext` guarda o estado de autenticação do professor.
  2. Ao efetuar login, o token `simulated_token` é gravado no `localStorage`.
  3. No arquivo [api.js](file:///home/gustavobee/fiap/fase-2/tech-challenge/frontend/src/services/api.js), criamos um **Axios Interceptor** que injeta automaticamente esse cabeçalho em todas as chamadas à API quando o usuário estiver autenticado:
     ```javascript
     api.interceptors.request.use((config) => {
       const token = localStorage.getItem('access_token');
       if (token) config.headers['access_token'] = token;
       return config;
     });
     ```

---

### Etapa 3 & 4: Visão Pública dos Alunos
- **Home (`/`)**: Consome `GET /posts`. Possui campo de busca que faz debounce e consulta `GET /posts/search?term=...`.
- **Leitura do Post (`/posts/:id`)**: Consome `GET /posts/:id`. Apresenta a aula completa, autor, disciplina e permite envio de comentários persistidos localmente.

---

### Etapa 5 & 6: Visão e Gestão dos Docentes (CRUD Protegido)
- **ProtectedRoute**: Bloqueia acessos não autorizados a rotas administrativas (`/admin`, `/admin/posts/novo`, `/admin/posts/editar/:id`). Alunos que tentarem acessar são redirecionados automaticamente para `/login`.
- **AdminDashboard (`/admin`)**: Exibe estatísticas, filtro por status (Publicado / Rascunho) e botões de ação para criar, editar ou excluir.
- **PostForm**: Formulário unificado que atende tanto a criação (`POST /posts`) quanto a edição (`PUT /posts/:id`).

---

### Etapa 7: Docker & Deploy
- **Dockerfile Multi-Stage**: O front-end é compilado no estágio `build` (Node.js) e os arquivos estáticos gerados na pasta `dist` são servidos por uma imagem leve do **NGINX**, garantindo máxima performance e baixíssimo consumo de memória.
- **Como Executar Tudo via Docker**:
  ```bash
  docker compose up --build
  ```
  - **Front-End (React + Nginx)**: `http://localhost:8080`
  - **Back-End (Node.js/Express API)**: `http://localhost:3000`
  - **Banco de Dados (PostgreSQL)**: `localhost:5433`

- **Como Executar Localmente em Modo de Desenvolvimento (sem Docker)**:
  1. Inicie a API Node no terminal principal:
     ```bash
     npm start
     ```
  2. Em outro terminal, navegue para a pasta `frontend` e execute:
     ```bash
     cd frontend
     npm run dev
     ```
