# Agents Project - Backend

API REST para gerenciamento de salas (rooms) em uma aplicação de agentes.

## 🛠️ Tecnologias Utilizadas

- **Node.js** v20+ (com TypeScript nativo)
- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Linguagem com tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM moderno para TypeScript
- **Zod** - Validação de esquemas
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
src/
├── db/
│   ├── connection.ts      # Conexão com banco
│   ├── schema/           # Esquemas do banco
│   └── migrations/       # Migrações do banco
├── http/
│   └── routes/          # Rotas da API
├── env.ts               # Configuração de ambiente
└── server.ts           # Servidor principal
```

## 🚀 Setup e Configuração

### 1. Pré-requisitos

- Node.js v20 ou superior
- Docker e Docker Compose

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd agents-backend

# Instale as dependências
npm install
```

### 3. Configuração do Banco de Dados

```bash
# Inicie o PostgreSQL com Docker
docker-compose up -d
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents_project
```

### 5. Executar Migrações

```bash
# Execute as migrações do banco
npx drizzle-kit migrate
```

### 6. Popular o Banco (Opcional)

```bash
# Execute o seed do banco
npm run db:seed
```

### 7. Executar a Aplicação

```bash
# Desenvolvimento (com watch mode)
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3333`

## 📋 Endpoints Disponíveis

- `GET /health` - Health check da aplicação
- `GET /rooms` - Lista todas as salas

## 🏗️ Padrões de Projeto

- **Plugin Architecture** - Uso de plugins Fastify para modularização
- **Type Safety** - Validação de tipos com Zod e TypeScript
- **Environment Validation** - Validação de variáveis de ambiente
- **Database Schema Management** - Versionamento de schema com Drizzle
- **CORS Configuration** - Configuração para frontend local

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com a extensão pgvector, configurado via Docker. O esquema principal inclui:

- **rooms** - Tabela para gerenciar salas/ambientes

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm start` - Executa em modo produção
- `npm run db:seed` - Popula o banco com dados iniciais
