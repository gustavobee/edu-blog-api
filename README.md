# 📚 FIAP Tech Challenge - EduBlog API

## 🎓 Sobre o Projeto
Este projeto é a entrega oficial do Tech Challenge da FIAP (Fase 2).
## 🎯 O Problema e a Solução
Atualmente, a maioria de professores e professoras da rede pública de educação não têm plataformas centralizadas e tecnológicas para postar suas aulas e transmitir conhecimento. 
Após o sucesso de um MVP (Produto Mínimo Viável) inicial feito em OutSystems, este projeto representa a escalada da aplicação de blogging educacional para um panorama nacional. Refatorei o back-end para **Node.js** com persistência em banco de dados relacional (**PostgreSQL**), visando alta performance, estabilidade e facilidade de manutenção.

## 🛠️ Tecnologias e Arquitetura
O sistema foi estruturado seguindo o padrão **MVC (Model-View-Controller)** para garantir uma separação clara de responsabilidades entre as regras de negócio, rotas e acesso a dados. A infraestrutura foi desenhada com base em microsserviços (conteinerização), separando a aplicação do banco de dados, mas garantindo que conversem em uma rede isolada.

*   **Linguagem/Framework:** Node.js com Express
*   **Padrão Arquitetural:** MVC (Model-View-Controller)
*   **Banco de Dados:** PostgreSQL 16
*   **ORM:** Sequelize
*   **Testes Unitários:** Jest
*   **Orquestração/Infraestrutura:** Docker e Docker Compose
*   **CI/CD (Integração Contínua):** GitHub Actions

## 🚀 Setup Inicial (Como rodar o projeto)
O projeto foi estruturado para ser totalmente *plug-and-play*. Todos os serviços (API e Banco de Dados) estão orquestrados via Docker Compose.

**Pré-requisitos:**
*   Docker e Docker Compose instalados.
*   Node.js (versão 24 ou superior) instalado localmente para rodar os testes isoladamente.

**Passo a passo:**

1. Clone este repositório:
   ```bash
   git clone [URL_DO_SEU_REPOSITORIO]
   cd [NOME_DA_PASTA]
2. Inicie os contêineres:
    ```bash
    docker compose up --build
*O Docker irá baixar o PostgreSQL, construir a imagem da API, expor a aplicação na porta `3000` e o banco de dados na porta `5433` (externa) e `5432` (interna).*

## 🧪 Cobertura de Testes

O projeto conta com testes unitários focados nas operações críticas (Criação, Edição e Exclusão). Para validar a cobertura de código localmente (sem a necessidade de subir o Docker), execute:

```bash
npm install
npm test
```

*A cobertura de testes atual do Controller principal ultrapassa os **20%** exigidos no edital, atingindo **50%**.*

## 📡 Guia de Uso das APIs (Endpoints)

A API responde na URL base: `http://localhost:3000`

### 1. Criar Postagem

* **POST** `/posts`
* **Descrição:** Permite que docentes criem novas postagens.
* **Body (JSON):**
```json
{
  "title": "A Revolução Francesa e seus Impactos",
  "author": "Professora Mariana",
  "content": "Neste resumo, revisamos os antecedentes...",
  "description": "Material de revisão sobre as causas.",
  "status": "publicado",
  "subject": "historia",
  "contentType": "resumo"
}
```



### 2. Listar Todas as Postagens

* **GET** `/posts`
* **Descrição:** Retorna a lista completa de aulas e materiais disponíveis.

### 3. Ler uma Postagem Específica

* **GET** `/posts/:id`
* **Descrição:** Retorna o conteúdo completo de um post baseado no seu ID.

### 4. Buscar Postagens (Search)

* **GET** `/posts/search?term=palavra_chave`
* **Descrição:** Busca posts filtrando o termo informado no Título ou no Conteúdo.

### 5. Atualizar Postagem

* **PUT** `/posts/:id`
* **Descrição:** Edita os dados de um post existente.
* **Body (JSON):**
```json
{
  "status": "arquivado",
  "contentType": "tarefa"
}
```



### 6. Excluir Postagem

* **DELETE** `/posts/:id`
* **Descrição:** Remove a postagem do banco de dados.

## 🧗‍♂️ Relato de Experiências e Desafios

Durante o desenvolvimento deste Tech Challenge, enfrentei e superei alguns desafios técnicos:

1. **Orquestração de Redes no Docker:** Passei um tempo quebrando a cabeça com a comunicação entre Node e PostgreSQL. Tava testando localmente e funcionava tudo, mas dentro do container não achava o banco. Aí descobri que `localhost` dentro da API não leva pro host mesmo, é relativo ao container. Criei uma rede unificada no `docker-compose.yml` e mudei a connection string pra apontar pro nome do serviço (`database`).
2. **Automação com GitHub Actions:** A esteira de CI quebrou nos primeiros testes devido à descontinuação do suporte oficial ao Node 20 por parte dos *runners* do GitHub. A solução rápida foi refatorar o arquivo `ci.yml` para exigir a versão 24 do Node.js, garantindo estabilidade e fluidez na Integração Contínua.
3. **Validações de Modelagem e MVC:** A separação rigorosa de responsabilidades exigida pelo MVC, atrelada às validações restritas do banco de dados, demandou um mapeamento muito cuidadoso. O rigor do PostgreSQL com restrições *allowNull* e *Enums* no nível do Model reforçou a importância de sanitizar entradas no Controller, especialmente ao gerenciar os padrões de nomenclatura *camelCase* vs *snake_case*.

---

**Desenvolvido por:**

* Gustavo Bee Campos Rocha - rm373106