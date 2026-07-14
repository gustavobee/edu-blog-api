# 📚 FIAP Tech Challenge - EduBlog API

## 1. Visão Geral e Escopo
Este projeto é a entrega oficial do Tech Challenge da FIAP (Fase 2). O escopo principal é a criação de uma API RESTful para uma aplicação de blogging educacional voltada à rede pública de ensino. 

Após o sucesso de um MVP inicial (desenvolvido em OutSystems), o projeto representa a escalada da solução para um panorama nacional. O foco é fornecer uma plataforma centralizada e tecnológica onde docentes possam postar e gerenciar aulas, e alunos possam consumir esse conhecimento de forma prática.

## 2. Metas e Restrições da Arquitetura
A arquitetura foi desenhada para suportar a escalabilidade do projeto, respeitando as seguintes metas e restrições técnicas estabelecidas no edital:
*   **Stack:** O back-end deve ser obrigatoriamente construído em **Node.js** com roteamento via framework **Express**.
*   **Persistência de Dados:** Utilização de um banco de dados relacional (**PostgreSQL 16**), gerenciado através do ORM **Sequelize**.
*   **Infraestrutura e Orquestração:** A aplicação e o banco de dados devem ser estritamente isolados e orquestrados em contêineres utilizando **Docker** e **Docker Compose**.
*   **Qualidade de Código:** Exigência de no mínimo **20% de cobertura de testes unitários** focados nas operações críticas da aplicação (Criação, Edição e Exclusão).
*   **Automação (CI/CD):** Pipeline de Integração Contínua configurado via **GitHub Actions** para validação automática de testes.

## 3. Visão Lógica
A aplicação foi estruturada seguindo o padrão **MVC (Model-View-Controller)**, garantindo uma separação clara entre a camada de persistência de dados, as regras de negócio e o roteamento das requisições.

**Segurança e Controle de Acesso (Segregação de Perfis):**
Para cumprir os requisitos de segurança e acesso do sistema, a camada de rotas conta com um Middleware de autenticação simulada que dita a lógica de permissões:
*   **Alunos (Acesso Público):** Podem listar e buscar através de endpoints abertos. A lógica de negócio no Controller aplica um filtro automático para exibir apenas postagens com o status `publicado`.
*   **Professores (Acesso Privado):** Têm acesso total ao sistema (CRUD completo, incluindo leitura de materiais em formato de rascunho ou arquivados). Requer o envio obrigatório do cabeçalho `access_token` com o valor `simulated_token` na requisição.

## 4. Visão de Processo e Implementação

### 4.1. Setup e Execução (Local)
A aplicação foi desenvolvida para ser *plug-and-play*.
1. Clone o repositório:
   ```bash
   git clone https://github.com/gustavobee/edu-blog-api.git
   cd edu-blog-api
2. Inicie a orquestração dos contêineres:
   ```bash
   docker compose up --build
*(O Docker exporá a aplicação na porta `3000` e o banco de dados na porta `5433` do host).*

### 4.2. Documentação da API (Endpoints)

A API responde na URL base: `http://localhost:3000`

**Rotas Públicas (Foco em Alunos):**

* `GET /posts` : Retorna a lista de postagens disponíveis (publicadas).
* `GET /posts/:id` : Retorna o conteúdo completo de uma postagem específica.
* `GET /posts/search?term=palavra_chave` : Busca postagens filtrando o termo informado no Título, Conteúdo ou Descrição.

**Rotas Privadas (Foco em Docentes - Exigem o header `access_token`):**

* `POST /posts` : Cria uma nova postagem (Requer JSON no body com: `title`, `author`, `content`, `description`, `status`, `subject`, `contentType`).
* `PUT /posts/:id` : Edita os dados de uma postagem existente.
* `DELETE /posts/:id` : Remove a postagem do banco de dados de forma definitiva.

### 4.3. Testes Unitários

Os testes foram implementados com a biblioteca **Jest**, validando o comportamento isolado do Controller. Para rodar a suíte localmente (sem a necessidade de subir o Docker) e verificar o relatório de cobertura:

```bash
npm install
npm test
```

*A cobertura atual de testes no arquivo `postController` atinge a marca de **34.42%**, superando de forma segura a meta imposta.*

## 5. Decisões Técnicas e Desafios
Durante a implementação individual desta arquitetura, algumas decisões precisaram ser tomadas para contornar desafios técnicos reais:

*   **Comunicação de Rede no Docker:** Ao conteinerizar os serviços, a conexão clássica via `localhost` entre a API Node e o banco PostgreSQL falhava devido ao isolamento intrínseco dos contêineres. A solução arquitetural adotada foi desenhar uma rede bridge unificada no arquivo `docker-compose.yml` e configurar a string do Sequelize para resolver o nome do serviço DNS interno (`database`).
*   **Manutenção de CI/CD:** A esteira inicial configurada no GitHub Actions apresentou falhas prematuras causadas pela descontinuação do suporte oficial ao Node 20 por parte dos *runners* da plataforma. A decisão de refatoração rápida envolveu atualizar o ambiente da esteira para exigir a versão 24 do Node.js, assegurando a fluidez da Integração Contínua.
*   **Tratamento de Restrições (Model vs Controller):** O mapeamento restrito do banco relacional (com uso intenso de `allowNull` e restrições de `Enums`) exigiu cautela. O rigor do Sequelize reforçou a decisão de aplicar lógicas de tratamento robustas no Controller. Isso garantiu que o tráfego de dados na aplicação respeitasse o *camelCase* do JavaScript sem ferir as travas estruturais de integridade das tabelas do banco.
*   **Autenticação Dinâmica e Segregação de Acesso:** Para separar a visão de alunos e professores sem duplicar as rotas de leitura (`GET`), a decisão técnica foi aplicar um Middleware de validação via *header* (`access_token`). O desafio de negócio foi resolvido injetando uma regra no Controller: requisições não autenticadas (alunos) recebem silenciosamente um filtro *Where* no Sequelize para retornar apenas conteúdos com status `publicado`, enquanto requisições autenticadas (professores) acessam a base integral.
*   **Imutabilidade e Cache do Docker:** Durante a refatoração das lógicas de segurança, as validações via Postman apresentaram inconsistências. O desafio foi gerenciar a ausência de *hot-reload* do contêiner configurado para simular produção. A solução exigiu a compreensão da imutabilidade das imagens no Docker, sendo necessário forçar uma nova construção (`docker compose up --build`) para que o ambiente isolado absorvesse as alterações feitas no código-fonte local.

---

**Desenvolvido por:**

* Gustavo Bee Campos Rocha - rm373106