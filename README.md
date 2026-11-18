# 📚 FIAP Tech Challenge - EduBlog (Full-Stack & Mobile)

Plataforma integrada de publicação e consumo de conteúdos educacionais desenvolvida para a rede pública de ensino, conectando docentes e estudantes através de uma arquitetura moderna, escalável, conteinerizada e multiplataforma (Web e Mobile).

---

## 1. Visão Geral e Escopo

Este projeto consolida a evolução da plataforma **EduBlog** ao longo das fases do Tech Challenge da FIAP:
* **Fase 2 (Back-End & API):** Desenvolvimento de uma API RESTful robusta, com persistência em banco relacional, segregação de permissões e cobertura de testes unitários.
* **Fase 3 (Front-End Web & Integração Completa):** Construção de uma interface web gráfica intuitiva e responsiva em **React**, permitindo que alunos explorem aulas e professores gerenciem o ciclo de vida completo de seus conteúdos.
* **Fase 4 (Aplicativo Mobile - React Native & Expo):** Desenvolvimento do aplicativo móvel nativo com **React Native e Expo**, expandindo a plataforma com gestão completa (CRUD paginado) de **Professores** e **Estudantes**, administração de postagens, autenticação por perfil e resiliência offline.

A solução atende a dois públicos essenciais:
* **Estudantes e Visitantes:** Navegação fluida por disciplinas, pesquisa de conteúdos com busca em tempo real, leitura imersiva de aulas e espaço de comentários.
* **Professores e Docentes:** Área restrita protegida por autenticação, painel administrativo centralizado, métricas em tempo real e controle total (CRUD) sobre publicações, rascunhos, arquivamentos, corpo docente e alunos matriculados.

---

## 2. Arquitetura e Tecnologias

A arquitetura foi desenhada para garantir separação de responsabilidades, alta disponibilidade, escalabilidade e facilidade de implantação:

```text
┌──────────────────────────────┐ ┌──────────────────────────────┐
│        NAVEGADOR WEB         │ │      DISPOSITIVO MOBILE      │
│   Aluno / Docente (Browser)  │ │ Android Studio / Expo Go App │
└──────────────┬───────────────┘ └──────────────┬───────────────┘
               │ HTTP                           │
               ▼                                ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  FRONT-END WEB (React+Vite)  │ │   APP MOBILE (React Native)  │
│  SPA via NGINX (Porta 8080)  │ │  Expo SDK 58 + Navigation 7  │
└──────────────┬───────────────┘ └──────────────┬───────────────┘
               │                                │
               └───────────────┬────────────────┘
                               │ Axios + Header access_token
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                  BACK-END (Node.js + Express)                 │
│              API RESTful Conteinerizada (Porta 3000)          │
│   - Middleware de Auth   - Controllers (MVC)  - Sequelize ORM │
└──────────────────────────────┬────────────────────────────────┘
                               │ PostgreSQL Dialect
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                   BANCO DE DADOS (PostgreSQL 16)              │
│             Instância Conteinerizada (Porta 5433)             │
└───────────────────────────────────────────────────────────────┘
```

### Stack Tecnológica

| Camada | Tecnologia | Papel no Projeto |
| :--- | :--- | :--- |
| **App Mobile** | React Native + Expo SDK 58 | Aplicativo móvel multiplataforma (Android, iOS e Web) com Hooks |
| **Navegação Mobile**| React Navigation 7 | Navegação combinada via Bottom Tabs e Native Stack |
| **Persistência Local**| AsyncStorage | Armazenamento de sessão, configuração dinâmica de IP e cache offline |
| **Front-End Web** | React 19 + Vite | SPA moderna com renderização ultrarrápida e componentes modulares |
| **Roteamento Web** | React Router 7 | Navegação client-side, histórico e controle de rotas protegidas |
| **Comunicação HTTP**| Axios | Cliente HTTP configurado com interceptors para injeção automática de tokens |
| **Estado Global** | React Context API | Gerenciamento centralizado da sessão e credenciais do professor/aluno |
| **Estilização** | CSS3 / StyleSheet | Design system sob medida, tipografia acadêmica e responsividade mobile-first |
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
* **Autenticação Simulada (`/login`):** Login simulado que salva as credenciais e o token `simulated_token` no `localStorage` (Web) ou `AsyncStorage` (Mobile).
* **Rotas Protegidas (`ProtectedRoute`):** Redirecionamento automático de usuários não autorizados que tentem acessar rotas administrativas pela URL.
* **Painel Administrativo (`/admin`):**
  * Visualização unificada de todas as postagens (publicadas, rascunhos e arquivadas).
  * **Barra de Filtros Dinâmica:** Filtros por status com contadores em tempo real.
  * **Operações de CRUD:** Criação de novos conteúdos (`/admin/posts/novo`), edição (`/admin/posts/editar/:id`) e exclusão definitiva com confirmação de segurança.
* **Responsividade Mobile:** Barra de filtros que se reorganiza em grade 2x2 no celular, botões de toque largo e cards fluidos sem transbordamento horizontal.

### 3.3. Aplicativo Mobile (React Native & Expo - Fase 4)
* **Feed de Aulas (`HomeScreen`):** Listagem de postagens públicas com busca por palavra-chave, carrossel de filtro por disciplina e *pull-to-refresh*.
* **Leitura & Comentários (`PostDetailsScreen`):** Leitura completa do conteúdo didático e envio interativo de comentários pelos alunos.
* **Gestão Administrativa de Postagens (`AdminPostsScreen` & `PostFormScreen`):** Painel exclusivo para docentes com contadores por status, criação, edição e exclusão com modal de confirmação.
* **Gestão de Professores (`TeachersScreen` & `TeacherFormScreen`):** Listagem paginada consumindo `GET /professores`, cadastro, edição e exclusão de docentes.
* **Gestão de Estudantes (`StudentsScreen` & `StudentFormScreen`):** Listagem paginada consumindo `GET /alunos`, matrícula, edição e exclusão de estudantes.
* **Configuração Dinâmica & Resiliência Offline (`SettingsScreen`):** Permite alterar a URL/IP da API diretamente pelo aplicativo e conta com *fallback* automático em `AsyncStorage` caso o servidor esteja offline.

---

## 4. Estrutura de Diretórios

O repositório adota uma organização Full-Stack limpa, separando claramente os clientes (Web e Mobile), o servidor e a infraestrutura:

```text
tech-challenge/
├── .github/workflows/          # Pipeline de CI/CD (GitHub Actions)
├── frontend/                   # Aplicação Front-End Web (React + Vite)
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
│   └── package.json            # Dependências e scripts do Front-End Web
├── mobile/                     # Aplicativo Mobile (React Native + Expo SDK 58)
│   ├── src/
│   │   ├── components/         # Badge, ConfirmModal, EmptyState, Pagination, PostCard
│   │   ├── config/             # apiConfig.js (Detecção de plataforma 10.0.2.2 / localhost)
│   │   ├── constants/          # colors.js e postConstants.js
│   │   ├── contexts/           # AuthContext.js (Sessão e permissões via AsyncStorage)
│   │   ├── navigation/         # AppNavigator.jsx (Bottom Tabs + Native Stack)
│   │   ├── screens/            # Home, PostDetails, PostForm, AdminPosts, Teachers, Students, Login, Settings
│   │   └── services/           # api.js, postService.js, teacherService.js, studentService.js, mockData.js
│   ├── App.js                  # Ponto de entrada do aplicativo mobile
│   └── package.json            # Dependências e scripts do Expo
├── src/                        # Aplicação Back-End (API Node.js + Express)
│   ├── config/                 # Conexão com o banco PostgreSQL via Sequelize
│   ├── controllers/            # postController, teacherController, studentController, authController
│   ├── middlewares/            # Interceptador de autenticação (access_token)
│   ├── models/                 # Modelos Sequelize (post.js, teacher.js, student.js)
│   └── routes/                 # Rotas REST (/posts, /professores, /alunos, /auth)
├── tests/                      # Suíte de testes unitários com Jest
├── docker-compose.yml          # Orquestrador multi-serviço (DB + API + Front Web)
├── Dockerfile                  # Imagem Docker da API Node.js
└── package.json                # Dependências e scripts principais
```

---

## 5. Setup e Execução

### 5.1. Subindo Back-End, Banco de Dados e Front-End Web (Docker Compose)

Toda a base de servidor e web (Banco + API + Front-End Web) pode ser iniciada com um único comando na raiz do projeto:

```bash
# 1. Clone o repositório
git clone https://github.com/gustavobee/edu-blog-api.git
cd edu-blog-api

# 2. Suba os contêineres (Banco, API e Front-End Web)
npm start
# (ou: docker compose up --build)
```

#### Endereços de Acesso:
* **Front-End Web (React / NGINX):** [`http://localhost:8080`](http://localhost:8080)
* **Back-End (API Node.js):** [`http://localhost:3000`](http://localhost:3000)
* **Banco de Dados (PostgreSQL):** `localhost:5433`

---

### 5.2. Executando o Aplicativo Mobile (React Native + Expo)

Com o Back-End rodando na porta `3000` (passo 5.1), abra um **novo terminal** para iniciar o aplicativo mobile:

#### Opção A: Emulador do Android Studio (Recomendado no Desktop)
1. Abra o **Android Studio** -> **Virtual Device Manager** e inicie (**▶ Play**) o seu emulador Android.
2. No terminal, instale as dependências do mobile (na primeira vez) e inicie o app no Android:
   ```bash
   cd mobile
   npm install
   npm run android
   # (ou na raiz do projeto: npm run mobile:start e pressione a tecla 'a')
   ```
   > **Nota:** No Android, o app utiliza automaticamente o endereço `http://10.0.2.2:3000` (definido em `mobile/src/config/apiConfig.js`), que aponta diretamente para o `localhost:3000` da máquina host.
   >
   > **Dica (Linux):** Caso o terminal não encontre o `adb`, exporte o caminho do SDK antes de iniciar:
   > ```bash
   > export ANDROID_HOME=$HOME/Android/Sdk
   > export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
   > ```

#### Opção B: Celular Físico (via aplicativo Expo Go)
1. Instale o app **Expo Go** na Google Play Store (Android) ou App Store (iOS).
2. Conecte o celular na mesma rede Wi-Fi do computador e execute na raiz:
   ```bash
   npm run mobile:start
   ```
3. Escaneie o QR Code exibido no terminal.
4. Para conectar ao Back-End da sua máquina, acesse a aba **Perfil** dentro do app e configure a URL da API com o IP local do seu computador (ex.: `http://192.168.1.XX:3000`).

#### Opção C: Visualização no Navegador (Expo Web)
```bash
cd mobile
npm run web
```

---

### 5.3. Execução Local em Modo de Desenvolvimento (Sem Docker na API/Web)

Caso deseje rodar a API e o Front-End Web localmente fora do Docker:

1. **Inicie apenas o Banco de Dados:**
   ```bash
   docker compose up database -d
   ```

2. **Inicie a API Back-End (Terminal 1):**
   ```bash
   npm install
   node src/app.js
   ```

3. **Inicie o Front-End Web React (Terminal 2):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *O front-end web estará disponível em `http://localhost:5173` e se comunicará com a API em `http://localhost:3000`.*

---

### 5.4. Testes Automatizados e Linters

* **Testes Unitários do Back-End (Jest):**
  ```bash
  npm test
  ```
  *(Executa os 15 testes unitários cobrindo `postController`, `teacherController` e `studentController`, com cobertura superior a **54%**, superando os 20% mínimos exigidos).*

* **Validação de Código do Front-End Web (Oxlint / Build):**
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```

---

## 6. Documentação da API REST

A API responde na URL base `http://localhost:3000` (ou `http://10.0.2.2:3000` no Emulador Android) e é consumida tanto pelo Front-End Web quanto pelo App Mobile:

### Autenticação
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autentica docente ou estudante e retorna `access_token` e permissões |
| `GET` | `/auth/verify` | Valida o token enviado no header `access_token` |

### Postagens (`/posts`)
| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Público / Privado | Retorna posts publicados (ou **todos** se enviar `access_token: simulated_token`) |
| `GET` | `/posts/:id` | Público | Retorna os detalhes de uma postagem específica |
| `GET` | `/posts/search?term=palavra` | Público | Pesquisa postagens por termo no título, descrição ou conteúdo |
| `POST` | `/posts` | Professor | Cadastra nova postagem (`title`, `author`, `content`, `description`, `status`, `subject`, `contentType`) |
| `PUT` | `/posts/:id` | Professor | Atualiza os dados de uma postagem existente |
| `DELETE` | `/posts/:id` | Professor | Remove a postagem do banco de dados definitivamente |

### Professores (`/professores`)
| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/professores?page=1&limit=4` | Público / App | Listagem paginada de docentes cadastrados |
| `GET` | `/professores/:id` | Público / App | Retorna os detalhes de um docente específico |
| `POST` | `/professores` | Professor | Cadastra novo professor (`name`, `email`, `subject`, `registration`, `bio`) |
| `PUT` | `/professores/:id` | Professor | Atualiza os dados de um professor existente |
| `DELETE` | `/professores/:id` | Professor | Remove o registro do professor |

### Estudantes (`/alunos`)
| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/alunos?page=1&limit=4` | Público / App | Listagem paginada de estudantes matriculados |
| `GET` | `/alunos/:id` | Público / App | Retorna os detalhes de um estudante específico |
| `POST` | `/alunos` | Professor | Cadastra novo estudante (`name`, `email`, `grade`, `registration`) |
| `PUT` | `/alunos/:id` | Professor | Atualiza os dados cadastrais de um estudante |
| `DELETE` | `/alunos/:id` | Professor | Remove o registro do estudante |

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
* **Configuração do Emulador Android Studio no Linux:** Configurar o ambiente do emulador Android para rodar de forma integrada com o Expo exigiu superar diversos obstáculos de infraestrutura local: instalação das versões corretas do Android SDK, *Platform-Tools* e imagens de sistema no *Virtual Device Manager* (AVD), além do mapeamento das variáveis de ambiente (`ANDROID_HOME`, `emulator` e `platform-tools` no `PATH`) para que o CLI do Expo conseguisse detectar o dispositivo virtual via `adb` e instalar o cliente automaticamente.
* **Roteamento de Rede no Emulador Android (`10.0.2.2`) e Fallback Offline:** No emulador do Android Studio, o endereço `localhost` aponta para o próprio sistema operacional Android virtualizado, e não para o computador onde a API está rodando em Docker. Para resolver isso, o módulo `apiConfig.js` detecta automaticamente a plataforma (`Platform.OS === 'android'`) e redireciona o tráfego para o IP de loopback especial `http://10.0.2.2:3000`, além de permitir configuração dinâmica de IP na tela de Perfil e sincronização local via `AsyncStorage` caso o servidor esteja inacessível.

---

**Desenvolvido por:**
* **Gustavo Bee Campos Rocha** - rm373106 (FIAP Tech Challenge)