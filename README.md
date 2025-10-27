# 🦆 Primordial Duck Operation

Sistema completo para catalogação, análise e operações de captura de Patos Primordiais, desenvolvido para o desafio **"O Enigma dos Patos Primordiais"** - Dsin Coder Challenge 2025.

> **Repositório Full-Stack**: Backend (.NET 9) + Frontend (React) + Docker em um único repositório Git.

## 🏗️ Arquitetura do Projeto

### 📦 Estrutura Geral
```
PrimordialDuckOperation/
├── backend/                      # API .NET 9
│   ├── PrimordialDuckOperation.Api/           # Controllers e Middleware
│   ├── PrimordialDuckOperation.Application/   # Services, DTOs, Commands, Queries
│   ├── PrimordialDuckOperation.Domain/        # Entidades, Value Objects, Interfaces
│   ├── PrimordialDuckOperation.Infrastructure/# EF Core, Repositories, Migrations
│   ├── PrimordialDuckOperation.CrossCutting/  # DI, JWT, Swagger
│   └── PrimordialDuckOperation.Tests/         # Testes unitários
├── frontend/primordial-duck-frontend/         # SPA React
└── docker-compose.yml                         # Orquestração de containers
```

### 🎯 Backend (.NET 9 C#) - Clean Architecture/DDD

#### **Camada de Domínio** (`Domain`)
- **Entidades**: `Drone`, `PrimordialDuck`, `SuperPower`, `CaptureOperation`, `User`
- **Value Objects**: `HeightMeasurement`, `WeightMeasurement`, `Location`, `PrecisionMeasurement`
- **Enums**: `DroneTypeEnum`, `HibernationStatusEnum`, `SuperPowerClassificationEnum`, `CaptureStrategyEnum`, `DefenseTypeEnum`, `CaptureResultEnum`
- **Interfaces de Repositório**: Contratos para acesso a dados
- **Regras de Negócio**: Encapsuladas nas entidades

#### **Camada de Aplicação** (`Application`)
- **Services**: 
  - `AuthService` - Autenticação e gerenciamento de usuários
  - `CaptureAnalysisService` - Análise de viabilidade de captura (4 métricas)
  - `CaptureStrategyService` - Geração de estratégias e defesas
  - `EmailService` - Integração com EmailJS
- **DTOs**: Objetos de transferência de dados
- **Commands/Queries**: Separação de operações de leitura e escrita
- **Interfaces**: Contratos de serviços

#### **Camada de Infraestrutura** (`Infrastructure`)
- **Entity Framework Core 9.0**: ORM principal
- **Repositories**: Implementação do Repository Pattern
- **Configurations**: Fluent API para mapeamento (nomes em PT-BR)
- **Migrations**: Controle de versão do banco de dados
- **DataSeeder**: População inicial de dados

#### **Camada de API** (`Api`)
- **Controllers**: `AuthController`, `DronesController`, `PrimordialDucksController`, `SuperPowersController`, `CaptureOperationsController`
- **Middleware**: `ExceptionHandlerMiddleware` para tratamento global de erros
- **Program.cs**: Configuração da aplicação

#### **Camada CrossCutting** (`CrossCutting`)
- **Dependency Injection**: Registro de serviços
- **JWT Authentication**: Configuração de autenticação
- **Swagger/OpenAPI**: Documentação interativa da API
- **CORS**: Configuração de origens permitidas

### 🎨 Frontend (React 19 + Vite 7)

#### **Padrões de Arquitetura**
- **Component-Based Architecture**: Componentes reutilizáveis
- **Context API**: Gerenciamento de estado global (AuthContext)
- **Custom Hooks**: Lógica compartilhada (useAuth)
- **Service Layer**: Camada de serviços para comunicação com API

#### **Estrutura de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal
│   ├── FilterPanel.jsx # Filtros genéricos
│   └── Pagination.jsx  # Paginação
├── pages/              # Páginas da aplicação
├── contexts/           # Context API (AuthContext)
├── services/           # Chamadas à API
├── App.jsx             # Rotas principais
└── main.jsx           # Entry point
```

#### **Tecnologias Principais**
- **React 19.1.1**: Biblioteca UI
- **React Router 7.9.4**: Roteamento SPA
- **Axios**: Cliente HTTP
- **EmailJS**: Envio de emails
- **CSS Modules**: Estilização componentizada

### 🗄️ Banco de Dados (MySQL 8.0)

#### **Estratégia de Nomenclatura**
- **Código (C#)**: Propriedades em inglês
- **Banco de Dados**: Colunas em português (via Fluent API)
- **Exemplo**: `HeightMeasurement.Value` → coluna `Valor`

#### **Principais Tabelas**
- `Usuarios` - Sistema de autenticação
- `Drones` - Catalogação de drones
- `PatosPrimordiais` - Dados dos patos
- `SuperPoderes` - Classificação de poderes
- `OperacoesDeCapturas` - Missões de captura

#### **Recursos**
- **Migrations**: Versionamento automático do schema
- **DataSeeder**: Dados de demonstração
- **Indexes**: Otimização de consultas
- **Foreign Keys**: Integridade referencial

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação e Segurança
- ✅ Login com JWT
- ✅ Registro de novos usuários
- ✅ Esqueci minha senha (envio de senha temporária por email)
- ✅ Alteração de senha (usuário logado)
- ✅ Roles (Administrador, Operador, Visualizador)

### 📋 1ª Missão - Catalogação
- ✅ **Gestão de Drones** com dados completos:
  - Identificação e Combate
  - Conversão automática de unidades
  - CRUD completo com filtros e paginação
- ✅ **Catalogação de Patos Primordiais**:
  - Medidas com conversão (cm/pés, g/libras, cm/jardas)
  - Localização GPS com precisão
  - Status de hibernação (Desperto, Em Transe, Hibernação Profunda)
  - Batimentos cardíacos para estados dormentes
  - Contagem de mutações
- ✅ **Super Poderes** com classificações:
  - Temporal, Dimensional, Bélico, Psíquico, etc.
  - CRUD completo

### 📊 2ª Missão - Análise de Captura
- ✅ **Sistema de Análise Estratégica** com 4 métricas:
  - **Custo Operacional** (0-100%)
  - **Poder Militar** (0-100%)
  - **Nível de Risco** (0-100%)
  - **Valor Científico** (0-100%)
- ✅ **Cálculo de Score Geral** com:
  - Fórmula complexa baseada em todas as métricas
  - Bônus de capturabilidade por estado
  - Penalidades de custo, risco e poder militar
- ✅ **Classificação de Prioridade**:
  - Máxima (85-100)
  - Alta (70-84)
  - Moderada (50-69)
  - Baixa (30-49)
  - Considerável (15-29)
  - Não Recomendado (0-14)
- ✅ **Página de Documentação** da lógica de captura

### 🎯 3ª Missão - Operação de Captura
- ✅ **6 Estratégias de Ataque Inteligentes**:
  - Bombardeio Aéreo, Assalto Direto, Armadilhas
  - Táticas de Distração, Aproximação Furtiva, Emboscada Subaquática
- ✅ **6 Defesas Aleatórias**:
  - Escudo de Energia, Camuflagem, Teletransporte
  - Barreira Psíquica, Proteção Elemental, Distorção Temporal
- ✅ **Cálculo de Taxa de Sucesso** (5-95%)
- ✅ **Status do Drone**: Bateria, Combustível, Integridade
- ✅ **Gestão de Operações**: CRUD completo com histórico

---

## 🚀 Como Executar o Projeto

### 🐳 **Opção 1: Docker Compose (Recomendado para Produção)**

**Pré-requisitos**: 
- Docker Desktop (Windows/Mac) ou Docker Engine + Docker Compose (Linux)

**Passos**:

```bash
# 1. Clone o repositório
git clone https://github.com/daniellebassetto/primordial-duck-operation.git
cd primordial-duck-operation

# 2. Configure as variáveis de ambiente
# Edite o arquivo .env na raiz com suas credenciais EmailJS
# VITE_EMAILJS_SERVICE_ID=seu_service_id
# VITE_EMAILJS_TEMPLATE_ID=seu_template_id
# VITE_EMAILJS_PUBLIC_KEY=sua_public_key

# 3. Inicie os containers
docker-compose up -d --build

# 4. Aguarde ~30s para o MySQL inicializar e as migrations serem aplicadas

# 5. Acesse:
# Frontend: http://localhost:3000
# API: http://localhost:7000
# Swagger: http://localhost:7000/swagger
# MySQL: localhost:3307
```

**Usuário inicial criado automaticamente**:
- **Email**: `admin@primordialduck.com`
- **Senha**: `Admin@123`
- **Role**: Administrador

**Comandos úteis**:
```bash
# Ver logs dos containers
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar os containers
docker-compose down

# Parar e remover volumes (apaga banco de dados)
docker-compose down -v

# Rebuild completo
docker-compose up -d --build --force-recreate
```

📖 **Documentação completa**: Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deployment.

---

### 💻 **Opção 2: Desenvolvimento Local (Sem Docker)**

**Pré-requisitos**: 
- .NET 9 SDK ([Download](https://dotnet.microsoft.com/download/dotnet/9.0))
- Node.js 18+ e npm ([Download](https://nodejs.org/))
- MySQL Server 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))

#### **Backend (.NET API)**

```bash
# 1. Navegue até a pasta backend
cd backend

# 2. Configure a connection string
# Edite: PrimordialDuckOperation.Api/appsettings.Development.json
# "DefaultConnection": "server=localhost;port=3306;database=primordialduck;user=root;password=SUA_SENHA"

# 3. Restaure as dependências
dotnet restore

# 4. Crie o banco de dados (se não existir)
# Via MySQL Workbench ou terminal:
# CREATE DATABASE primordialduck CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 5. Gere e aplique as migrations
dotnet ef migrations add InitialCreate --project PrimordialDuckOperation.Infrastructure --startup-project PrimordialDuckOperation.Api
dotnet ef database update --project PrimordialDuckOperation.Infrastructure --startup-project PrimordialDuckOperation.Api

# 6. Execute a API
dotnet run --project PrimordialDuckOperation.Api

# API estará disponível em:
# - http://localhost:7000
# - https://localhost:7001
# - Swagger: http://localhost:7000/swagger
```

#### **Frontend (React App)**

```bash
# 1. Navegue até a pasta frontend
cd frontend/primordial-duck-frontend

# 2. Instale as dependências
npm install

# 3. Configure variáveis de ambiente
# Crie o arquivo .env.development com:
VITE_API_URL=http://localhost:7000/api
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key

# 4. Execute o projeto em modo desenvolvimento
npm run dev

# Frontend estará disponível em:
# - http://localhost:5173 (Vite dev server)
```

**Para build de produção**:
```bash
npm run build
npm run preview  # Serve o build localmente
```

---

### 🔧 **Opção 3: Desenvolvimento Híbrido (MySQL Docker + Aplicações Locais)**

**Útil para desenvolver sem ter MySQL instalado localmente**:

```bash
# 1. Inicie apenas o MySQL via Docker
docker run -d \
  --name primordial-mysql \
  -e MYSQL_ROOT_PASSWORD=primordial2025 \
  -e MYSQL_DATABASE=primordialduck \
  -p 3307:3306 \
  mysql:8.0

# 2. Configure backend para usar localhost:3307
# appsettings.Development.json:
# "DefaultConnection": "server=localhost;port=3307;database=primordialduck;user=root;password=primordial2025"

# 3. Execute backend e frontend localmente (veja Opção 2)
```

---

## 📡 Endpoints da API

### 🔐 Autenticação (`/api/auth`)
- `POST /login` - Login de usuário
- `POST /register` - Registro de novo usuário
- `POST /forgot-password` - Solicitar redefinição de senha
- `POST /change-password` - Alterar senha (autenticado)

### 🚁 Drones (`/api/drones`)
- `GET /` - Lista todos os drones (com filtros e paginação)
- `POST /` - Cria um novo drone
- `GET /{id}` - Busca drone por ID
- `PUT /{id}` - Atualiza drone
- `DELETE /{id}` - Remove drone

### ⚡ Super Poderes (`/api/superpowers`)
- `GET /` - Lista todos os super poderes
- `POST /` - Cria um novo super poder
- `GET /{id}` - Busca super poder por ID
- `PUT /{id}` - Atualiza super poder
- `DELETE /{id}` - Remove super poder

### 🦆 Patos Primordiais (`/api/primordialducks`)
- `GET /` - Lista todos os patos (com filtros e paginação)
- `POST /` - Registra um novo pato
- `GET /{id}` - Busca pato por ID
- `PUT /{id}` - Atualiza pato
- `DELETE /{id}` - Remove pato

### 🎯 Operações de Captura (`/api/captureoperations`)
- `GET /` - Lista todas as operações
- `POST /` - Cria nova operação
- `GET /{id}` - Busca operação por ID
- `PUT /{id}` - Atualiza operação
- `DELETE /{id}` - Remove operação

## 🎨 Tecnologias Utilizadas

### Backend
- **.NET 9** - Framework backend
- **ASP.NET Core Identity** - Autenticação e autorização
- **Entity Framework Core** - ORM
- **MySQL 8.0** - Banco de dados
- **JWT Bearer** - Autenticação stateless
- **Swagger/OpenAPI** - Documentação interativa
- **Newtonsoft.Json** - Serialização JSON

### Frontend
- **React 19** - Framework frontend
- **Vite 7** - Build tool e dev server
- **React Router 7** - Roteamento SPA
- **Axios** - Cliente HTTP
- **EmailJS** - Serviço de email
- **Lucide React** - Ícones
- **CSS Modules** - Estilização

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web para frontend
- **GitHub** - Controle de versão

## 📊 Portas e Serviços

| Serviço  | Porta | URL                          |
|----------|-------|------------------------------|
| MySQL    | 3307  | localhost:3307               |
| API      | 7000  | http://localhost:7000        |
| Swagger  | 7000  | http://localhost:7000/swagger|
| Frontend | 3000  | http://localhost:3000        |

## 🧪 Fluxo de Uso

1. **Login/Registro**
   - Acesse http://localhost:3000
   - Faça login ou registre-se

2. **Catalogação**
   - Cadastre Drones (Identificação e Combate)
   - Cadastre Super Poderes
   - Cadastre Patos Primordiais

3. **Análise**
   - Acesse "Análise de Captura"
   - Visualize scores e classificações
   - Consulte "Lógica de Captura" para entender os cálculos

4. **Operação**
   - Crie operações de captura
   - Associe drones e patos
   - Acompanhe o status

5. **Configurações**
   - Acesse "Configurações" no menu
   - Altere sua senha
   - Gerencie conta

## 👥 Autor

**Danielle Bassetto**
- GitHub: [@daniellebassetto](https://github.com/daniellebassetto)
- LinkedIn: [daniellebassetto](https://linkedin.com/in/daniellebassetto)

## 📝 Licença

Este projeto foi desenvolvido para o **Dsin Coder Challenge 2025**.

---

**Desenvolvido com 🦆 para desvendar o Enigma dos Patos Primordiais**