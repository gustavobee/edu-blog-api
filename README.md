# 📚 FIAP Tech Challenge - EduBlog (Full-Stack)

Plataforma integrada de publicação e consumo de conteúdos educacionais desenvolvida para a rede pública de ensino, conectando docentes e estudantes através de uma arquitetura moderna, escalável e conteinerizada.

---

## 1. Visão Geral e Escopo

Este projeto consolida a evolução da plataforma **EduBlog** ao longo das fases do Tech Challenge da FIAP:
* **Fase 2 (Back-End & API):** Desenvolvimento de uma API RESTful robusta, com persistência em banco relacional, segregação de permissões e cobertura de testes unitários.
* **Fase 3 (Front-End & Integração Completa):** Construção de uma interface web gráfica intuitiva e responsiva em **React**, permitindo que alunos explorem aulas e professores gerenciem o ciclo de vida completo de seus conteúdos.

A solução atende a dois públicos essenciais:
* **Estudantes e Visitantes:** Navegação fluida por disciplinas, pesquisa de conteúdos com busca em tempo real, leitura imersiva de aulas e espaço de comentários.
* **Professores e Docentes:** Área restrita protegida por autenticação, painel administrativo centralizado, métricas em tempo real e controle total (CRUD) sobre publicações, rascunhos e arquivamentos.

---

## 2. Arquitetura e Tecnologias

A arquitetura foi desenhada para garantir separação de responsabilidades, alta disponibilidade, escalabilidade e facilidade de implantação:

```text
┌─────────────────────────────────────────────────────────────┐
│                       NAVEGADOR                             │
│       Aluno (Visão Pública)  │  Docente (Painel Admin)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONT-END (React 19 + Vite)                 │
│      SPA servida via NGINX Multi-Stage (Porta 8080)         │
│  - React Router 7    - Context API (Auth)   - Axios Client  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Axios + Header access_token
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACK-END (Node.js + Express)                │
│             API RESTful Conteinerizada (Porta 3000)          │
│  - Middleware de Auth   - Controllers (MVC)  - Sequelize ORM │
└──────────────────────────────┬──────────────────────────────┘
                               │ PostgreSQL Dialect
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS (PostgreSQL 16)             │
│            Instância Conteinerizada (Porta 5433)            │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológica

| Camada | Tecnologia | Papel no Projeto |
| :--- | :--- | :--- |
| **Front-End** | React 19 + Vite | SPA moderna com renderização ultrarrápida e componentes modulares |
| **Roteamento Web** | React Router 7 | Navegação client-side, histórico e controle de rotas protegidas |
| **Comunicação HTTP**| Axios | Cliente HTTP configurado com interceptors para injeção automática de tokens |
| **Estado Global** | React Context API | Gerenciamento centralizado da sessão e credenciais do professor |
| **Estilização** | CSS3 Moderno | Design system sob medida, tipografia acadêmica e responsividade mobile-first |
| **Back-End** | Node.js + Express | API RESTful com arquitetura MVC e middlewares de segurança |
| **ORM / Banco** | Sequelize + PostgreSQL 16 | Mapeamento objeto-relacional e persistência estruturada com validação de Enums |
| **Infraestrutura** | Docker + Docker Compose | Conteinerização completa com build multi-stage e servidor NGINX para o front |
| **Testes & CI/CD** | Jest + GitHub Actions | Testes unitários com cobertura de código e pipeline de validação contínua |

---

## 3. Visão Lógica e Funcionalidades

A aplicação opera sob o conceito de **Segregação de Perfis**:

### 3.1. Visão do Aluno (Acesso Público)
* **Página Inicial (`/`):** Listagem automática de posts públicos.
* **Cards Uniformes:** Altura padronizada para títulos e resumos, mantendo o alinhamento visual perfeito na grade de publicações.
* **Tags Amigáveis:** Rótulos formatados com acentuação e sem separadores técnicos (ex: *Matemática*, *História*, *Aula*, *Material Complementar*).
* **Busca em Tempo Real com Debounce:** Pesquisa interativa por título, autor, assunto ou conteúdo, com espera de 400ms para evitar sobrecarga de requisições à API.
* **Leitura da Aula (`/posts/:id`):** Visualização completa do texto didático, dados do docente, data de publicação e seção interativa de comentários locais.

### 3.2. Visão do Professor (Acesso Privado / Autenticado)
* **Autenticação Simulada (`/login`):** Login simulado que salva as credenciais e o token `simulated_token` no `localStorage`.
* **Rotas Protegidas (`ProtectedRoute`):** Redirecionamento automático de usuários não autorizados que tentem acessar rotas administrativas pela URL.
* **Painel Administrativo (`/admin`):**
  * Visualização unificada de todas as postagens (publicadas, rascunhos e arquivadas).
  * **Barra de Filtros Dinâmica:** Filtros por status com contadores em tempo real.
  * **Operações de CRUD:** Criação de novos conteúdos (`/admin/posts/novo`), edição (`/admin/posts/editar/:id`) e exclusão definitiva com confirmação de segurança.
* **Responsividade Mobile:** Barra de filtros que se reorganiza em grade 2x2 no celular, botões de toque largo e cards fluidos sem transbordamento horizontal.

---

## 4. Estrutura de Diretórios

O repositório adota uma organização Full-Stack limpa, separando claramente o cliente, o servidor e a infraestrutura:

```text
tech-challenge/
├── .github/workflows/          # Pipeline de CI/CD (GitHub Actions)
├── frontend/                   # Aplicação Front-End (React + Vite)
│   ├── src/
│   │   ├── components/         # Header, Footer, PostCard, ProtectedRoute
│   │   ├── constants/          # Mapeamento amigável de Enums (disciplinas, tipos, status)
│   │   ├── contexts/           # AuthContext (Gestão de sessão e token)
│   │   ├── pages/              # Home, PostDetails, Login, AdminDashboard, PostForm
│   │   ├── services/           # api.js (Axios configurado com Interceptor)
│   │   ├── App.jsx             # Definição e proteção das rotas
│   │   └── index.css           # Estilização global, variáveis e media queries mobile
│   ├── Dockerfile              # Build Multi-Stage (Node.js Build + NGINX Runtime)
│   ├── nginx.conf              # Configuração do NGINX com suporte a SPA
│   └── package.json            # Dependências e scripts do Front-End
├── src/                        # Aplicação Back-End (API Node.js + Express)
│   ├── config/                 # Conexão com o banco PostgreSQL via Sequelize
│   ├── controllers/            # Lógica de negócio e tratamento de requisições
│   ├── middlewares/            # Interceptador de autenticação (access_token)
│   ├── models/                 # Modelos de dados e definições de Enums
│   └── routes/                 # Definição das rotas REST
├── tests/                      # Suíte de testes unitários com Jest
├── docker-compose.yml          # Orquestrador multi-serviço (DB + API + Front)
├── Dockerfile                  # Imagem Docker da API Node.js
└── package.json                # Dependências e scripts do Back-End
```

---

## 5. Setup e Execução

### 5.1. Execução Completa via Docker Compose (Recomendado)

Toda a solução (Banco + API + Front-End) pode ser iniciada com um único comando:

```bash
# 1. Clone o repositório
git clone https://github.com/gustavobee/edu-blog-api.git
cd edu-blog-api

# 2. Suba todos os serviços
docker compose up --build
```

#### Endereços de Acesso:
* **Front-End (React / NGINX):** [`http://localhost:8080`](http://localhost:8080)
* **Back-End (API Node.js):** [`http://localhost:3000`](http://localhost:3000)
* **Banco de Dados (PostgreSQL):** `localhost:5433`

---

### 5.2. Execução Local em Modo de Desenvolvimento (Sem Docker)

Caso deseje rodar os ambientes de desenvolvimento com *Hot Reload*:

1. **Inicie o Banco de Dados:**
   ```bash
   docker compose up database -d
   ```

2. **Inicie a API Back-End (Terminal 1):**
   ```bash
   npm install
   npm start
   ```

3. **Inicie o Front-End React (Terminal 2):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *O front-end estará disponível em `http://localhost:5173` e se comunicará com a API em `http://localhost:3000`.*

---

### 5.3. Testes Automatizados e Linters

* **Testes Unitários do Back-End (Jest):**
  ```bash
  npm test
  ```
  *(A cobertura atual do `postController` é de **34.42%**, superando os 20% mínimos exigidos).*

* **Validação de Código do Front-End (Oxlint / Build):**
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```

---

## 6. Documentação da API REST

A API responde na URL base `http://localhost:3000` e é consumida de forma integrada pelo Front-End:

### Rotas Públicas (Alunos e Visitantes)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/posts` | Retorna postagens públicas (filtro automático de `status = 'publicado'`) |
| `GET` | `/posts/:id` | Retorna os detalhes de uma postagem específica |
| `GET` | `/posts/search?term=palavra` | Pesquisa postagens por termo no título, descrição ou conteúdo |

### Rotas Privadas (Professores - Requerem header `access_token: simulated_token`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/posts` | Retorna **todas** as postagens (inclui rascunhos e arquivados) |
| `POST` | `/posts` | Cadastra nova postagem (`title`, `author`, `content`, `description`, `status`, `subject`, `contentType`) |
| `PUT` | `/posts/:id` | Atualiza os dados de uma postagem existente |
| `DELETE` | `/posts/:id` | Remove a postagem do banco de dados definitivamente |

---

## 7. Decisões Técnicas e Desafios Superados

Durante a arquitetura e implementação Full-Stack, decisões críticas foram tomadas para garantir robustez e fluidez:

* **Integração de CORS (Cross-Origin Resource Sharing):** Ao integrar o front-end na porta 8080 (ou 5173 em dev) com o back-end na porta 3000, as requisições eram bloqueadas pelas políticas de mesma origem dos navegadores. Foi implementado o middleware `cors` no Express para permitir a interoperabilidade segura entre as origens.
* **Suporte a SPA no NGINX:** Como a aplicação utiliza roteamento no cliente (`react-router-dom`), atualizar a página em rotas como `/admin` ou `/posts/1` resultava em erro `404 Not Found` no NGINX. A solução foi configurar a diretiva `try_files $uri $uri/ /index.html;` no `nginx.conf`, garantindo que todas as rotas sejam repassadas ao JavaScript do React.
* **Autenticação Transparente via Interceptor:** Para que o professor não precisasse reenviar manualmente as credenciais a cada clique, configurou-se um *Axios Request Interceptor* em `api.js`. Ele recupera o token do `localStorage` e o anexa ao cabeçalho `access_token`, mantendo a camada de visualização desacoplada da infraestrutura de segurança.
* **Padronização de Enums e Experiência do Usuário:** O banco PostgreSQL rejeita valores não pertencentes aos Enums cadastrados (como `matematica`, `aula_teorica`). Criou-se um módulo de constantes no front-end (`postConstants.js`) que traduz esses valores técnicos para rótulos legíveis, elegantes e acentuados na tela, prevenindo tanto erros de validação no formulário quanto textos truncados nos cards.
* **Responsividade e Otimização de Layout:** A interface foi projetada para dispositivos móveis:
  * A barra de filtros do painel administrativo se converte em grade 2x2 com toque fácil;
  * Os cards possuem altura travada para manter o nivelamento na tela inicial;
  * As tags de conteúdo utilizam `white-space: nowrap` para evitar quebras de linha estranhas em textos compostos.
* **Rede Isolada no Docker:** A comunicação entre contêineres utiliza uma rede *bridge* unificada. O front-end, o back-end e o banco resolvem seus hostnames diretamente via DNS interno do Docker Compose (`database` e `backend`).

---

**Desenvolvido por:**
* **Gustavo Bee Campos Rocha** - rm373106 (FIAP Tech Challenge)