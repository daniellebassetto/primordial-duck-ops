# 🔧 Backend - Primordial Duck Operation API

API RESTful construída com **.NET 9** e **Clean Architecture/DDD** para gerenciamento completo do sistema de catalogação e captura de Patos Primordiais.

---

## 🏗️ Arquitetura do Backend

### **Clean Architecture / Domain-Driven Design (DDD)**

O projeto segue os princípios de Clean Architecture com separação clara de responsabilidades em camadas:

```
backend/
├── PrimordialDuckOperation.Api/           # 🌐 Camada de Apresentação
├── PrimordialDuckOperation.Application/   # 💼 Camada de Aplicação
├── PrimordialDuckOperation.Domain/        # 🎯 Camada de Domínio
├── PrimordialDuckOperation.Infrastructure/# 🔧 Camada de Infraestrutura
├── PrimordialDuckOperation.CrossCutting/  # ⚙️ Configurações Transversais
└── PrimordialDuckOperation.Tests/         # 🧪 Testes Unitários
```

---

### 🎯 **1. Camada de Domínio** (`Domain`)

**Responsabilidade**: Regras de negócio e entidades principais do sistema.

**Componentes**:

#### **Entidades**:
- `User.cs` - Usuários do sistema
- `Drone.cs` - Drones de identificação e combate
- `PrimordialDuck.cs` - Patos primordiais
- `SuperPower.cs` - Super poderes
- `CaptureOperation.cs` - Operações de captura

#### **Value Objects** (Objetos de Valor):
- `HeightMeasurement` - Altura com conversão (cm ⟷ pés)
- `WeightMeasurement` - Peso com conversão (g ⟷ libras)
- `Location` - Localização GPS completa
- `PrecisionMeasurement` - Precisão GPS (cm ⟷ jardas)

#### **Enums**:
- `DroneTypeEnum` - Tipo do drone (Identificação, Combate)
- `HibernationStatusEnum` - Estado de hibernação (Desperto, Em Transe, Hibernação Profunda)
- `SuperPowerClassificationEnum` - Classificação de poderes (Temporal, Dimensional, Bélico, Psíquico, Elemental, Tecnológico, Biológico, Defensivo)
- `CaptureStrategyEnum` - Estratégias de captura (6 tipos)
- `DefenseTypeEnum` - Defesas aleatórias (6 tipos)
- `CaptureResultEnum` - Resultado da operação
- `UnitOfMeasureEnum` - Unidades de medida

#### **Interfaces de Repositório**:
- `IUserRepository`
- `IDroneRepository`
- `IPrimordialDuckRepository`
- `ISuperPowerRepository`
- `ICaptureOperationRepository`

**Características**:
- ✅ **Encapsulamento**: Lógica de negócio protegida nas entidades
- ✅ **Validações de Domínio**: Regras aplicadas diretamente nas entidades
- ✅ **Independência**: Não possui dependências externas

---

### 💼 **2. Camada de Aplicação** (`Application`)

**Responsabilidade**: Orquestração de casos de uso e lógica de aplicação.

**Componentes**:

#### **Services** (Serviços de Aplicação):

**AuthService.cs**
- Login e autenticação JWT
- Registro de usuários
- Esqueci minha senha (envio de senha temporária)
- Alteração de senha

**CaptureAnalysisService.cs** - Sistema de análise estratégica
- `CalculateOperationalCost()` - Custo operacional (0-100%)
- `CalculateMilitaryPower()` - Poder militar (0-100%)
- `CalculateRiskLevel()` - Nível de risco (0-100%)
- `CalculateScientificValue()` - Valor científico (0-100%)
- `CalculateOverallScore()` - Pontuação geral (1-100)
- `GetPriorityClassification()` - Classificação (6 níveis)

**CaptureStrategyService.cs** - Geração de estratégias
- `DetermineStrategy()` - Seleciona estratégia com base no pato
- `GenerateRandomDefense()` - Defesa aleatória
- `CalculateSuccessChance()` - Taxa de sucesso (5-95%)
- `GenerateReasoning()` - Justificativa da estratégia

**EmailService.cs**
- Integração com EmailJS para envio de emails
- Templates para reset de senha

#### **DTOs** (Data Transfer Objects):
- Requisição: `*CreateDto`, `*UpdateDto`
- Resposta: `*ResponseDto`, `*DetailDto`
- Autenticação: `LoginDto`, `RegisterDto`, `ChangePasswordDto`

#### **Commands e Queries** (CQRS Pattern):
- Separação entre operações de leitura e escrita
- Otimização de performance

**Características**:
- ✅ **Desacoplamento**: Usa interfaces ao invés de implementações concretas
- ✅ **Validações de Aplicação**: DTOs com DataAnnotations
- ✅ **Mapeamento**: Conversão entre entidades e DTOs

---

### 🔧 **3. Camada de Infraestrutura** (`Infrastructure`)

**Responsabilidade**: Implementação de acesso a dados e serviços externos.

**Componentes**:

#### **Data**:
- `PrimordialDuckDbContext.cs` - DbContext do Entity Framework
- `DataSeeder.cs` - População inicial do banco de dados

#### **Repositories** (Implementação):
- `UserRepository`
- `DroneRepository`
- `PrimordialDuckRepository`
- `SuperPowerRepository`
- `CaptureOperationRepository`

#### **Configurations** (Fluent API):
- `UserConfiguration.cs` - Mapeamento da tabela Usuarios
- `DroneConfiguration.cs` - Mapeamento da tabela Drones
- `PrimordialDuckConfiguration.cs` - Mapeamento com Value Objects
- Etc.

**Características do Mapeamento**:
- ✅ **Nomes em Português**: Tabelas e colunas em PT-BR
- ✅ **Propriedades em Inglês**: Código C# em inglês
- ✅ **Value Objects**: Mapeados como Owned Types
- ✅ **Índices**: Otimização de consultas

#### **Migrations**:
- `InitialCreate` - Criação inicial do schema
- Migrations automáticas via EF Core

**Características**:
- ✅ **Repository Pattern**: Abstração do acesso a dados
- ✅ **Unit of Work**: Transações gerenciadas pelo DbContext
- ✅ **Async/Await**: Operações assíncronas

---

### 🌐 **4. Camada de Apresentação** (`Api`)

**Responsabilidade**: Exposição de endpoints REST e configuração da API.

**Componentes**:

#### **Controllers**:
- `AuthController` - Autenticação e gestão de usuários
- `DronesController` - CRUD de drones
- `SuperPowersController` - CRUD de super poderes
- `PrimordialDucksController` - CRUD de patos
- `CaptureOperationsController` - CRUD de operações

**Padrões dos Controllers**:
- ✅ Herdam de `BaseController` (padronização)
- ✅ Atributo `[Authorize]` (proteção JWT)
- ✅ Validação automática de ModelState
- ✅ Status codes apropriados (200, 201, 400, 404, 500)
- ✅ Tratamento de exceções via middleware

#### **Middleware**:
- `ExceptionHandlerMiddleware` - Tratamento global de erros
  - Captura exceções não tratadas
  - Retorna respostas padronizadas
  - Log de erros

#### **Program.cs** - Configurações:
- Dependency Injection
- Entity Framework Core
- Authentication/Authorization (JWT)
- CORS
- Swagger/OpenAPI
- Migrations automáticas no startup

**Características**:
- ✅ **RESTful**: Verbos HTTP corretos (GET, POST, PUT, DELETE)
- ✅ **Paginação**: Suporte a páginas e tamanho de página
- ✅ **Filtros**: Query parameters para busca
- ✅ **Versionamento**: Preparado para versionamento de API

---

### ⚙️ **5. Camada CrossCutting** (`CrossCutting`)

**Responsabilidade**: Configurações compartilhadas entre camadas.

**Componentes**:

#### **ConfigureServicesExtension.cs**:
- Registro de serviços no DI Container
- Configuração de JWT
- Configuração de CORS
- Configuração do Identity
- Configuração do DbContext

#### **Swagger**:
- Documentação interativa da API
- Definição de schemas
- Exemplos de requisições/respostas
- Autenticação via Bearer Token

**Características**:
- ✅ **Dependency Injection**: Injeção de dependências do .NET
- ✅ **Configurações Centralizadas**: Único ponto de configuração
- ✅ **Extensibilidade**: Fácil adição de novos serviços

---

## 🔐 Segurança

### **JWT Authentication**
- Tokens de autenticação stateless
- Expiração configurável (padrão: 7 dias)
- Claims customizados (Id, Email, Role)

### **ASP.NET Identity**
- Hash de senhas com PBKDF2
- Validação de senha forte
- Sistema de roles (Admin, Operator, Viewer)

### **CORS**
- Configurado para frontend na porta 3000
- Políticas customizáveis

---

## 📡 Padrões de API

### **Nomenclatura de Endpoints**
```
GET    /api/primordialducks        - Lista todos
GET    /api/primordialducks/{id}   - Busca por ID
POST   /api/primordialducks        - Cria novo
PUT    /api/primordialducks/{id}   - Atualiza
DELETE /api/primordialducks/{id}   - Remove
```

### **Formato de Respostas**

**Sucesso (200 OK)**:
```json
{
  "id": 1,
  "name": "Pato Alfa",
  ...
}
```

**Erro (400 Bad Request)**:
```json
{
  "message": "Dados inválidos",
  "errors": {
    "Height": ["A altura é obrigatória"]
  }
}
```

**Erro (500 Internal Server Error)**:
```json
{
  "message": "Erro interno do servidor",
  "details": "..."
}
```

---

## 🚀 Como Executar

### **Opção 1: Docker (Recomendado)**

```bash
# Na raiz do projeto
docker-compose up -d

# API estará em: http://localhost:7000
# Swagger: http://localhost:7000/swagger
```

---

### **Opção 2: Desenvolvimento Local**

#### **Pré-requisitos**:
- .NET 9 SDK
- MySQL Server 8.0+
- EF Core Tools: `dotnet tool install --global dotnet-ef`

#### **Passos**:

```bash
# 1. Navegue até a pasta backend
cd backend

# 2. Restaure as dependências
dotnet restore

# 3. Configure a connection string
# Edite: PrimordialDuckOperation.Api/appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=primordialduck;user=root;password=SUA_SENHA"
  }
}

# 4. Crie o banco de dados
# Via MySQL Workbench ou terminal MySQL:
CREATE DATABASE primordialduck CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 5. Gere e aplique as migrations
dotnet ef migrations add InitialCreate \
  --project PrimordialDuckOperation.Infrastructure \
  --startup-project PrimordialDuckOperation.Api

dotnet ef database update \
  --project PrimordialDuckOperation.Infrastructure \
  --startup-project PrimordialDuckOperation.Api

# 6. Execute a API
dotnet run --project PrimordialDuckOperation.Api

# Ou para watch mode (recarga automática):
dotnet watch run --project PrimordialDuckOperation.Api
```

**API estará disponível em**:
- HTTP: `http://localhost:7000`
- HTTPS: `https://localhost:7001`
- Swagger: `http://localhost:7000/swagger`

---

## 🧪 Testes

```bash
# Executar todos os testes
dotnet test

# Executar com cobertura
dotnet test /p:CollectCoverage=true

# Executar testes de um projeto específico
dotnet test PrimordialDuckOperation.Tests
```


---

## 📊 Tecnologias e Pacotes

### **Frameworks**
- .NET 9.0
- ASP.NET Core 9.0

### **Principais Pacotes NuGet**
- `Microsoft.EntityFrameworkCore` - ORM
- `Pomelo.EntityFrameworkCore.MySql` - Provider MySQL
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` - Autenticação
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT
- `Swashbuckle.AspNetCore` - Swagger
- `Newtonsoft.Json` - Serialização JSON

### **Ferramentas de Desenvolvimento**
- `Microsoft.EntityFrameworkCore.Tools` - EF Core CLI
- `Microsoft.EntityFrameworkCore.Design` - Design-time tools

---

## 🎯 Boas Práticas Implementadas

- ✅ **Clean Architecture** - Separação clara de responsabilidades
- ✅ **DDD** - Domain-Driven Design com entidades ricas
- ✅ **Repository Pattern** - Abstração do acesso a dados
- ✅ **Dependency Injection** - Inversão de controle
- ✅ **SOLID Principles** - Código manutenível e extensível
- ✅ **Async/Await** - Operações assíncronas
- ✅ **Error Handling** - Tratamento global de exceções
- ✅ **Validation** - Validação em múltiplas camadas
- ✅ **DTOs** - Separação entre domínio e apresentação
- ✅ **Value Objects** - Lógica encapsulada
- ✅ **Migrations** - Versionamento do banco
- ✅ **Swagger** - Documentação automática

---

## 📚 Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

---

**Desenvolvido para o Dsin Coder Challenge 2025** 🦆