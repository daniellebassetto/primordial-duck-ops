# 🎨 Frontend - Primordial Duck Operation

Interface web moderna construída com **React 19** e **Vite 7** para gerenciamento completo do sistema de catalogação e captura de Patos Primordiais.

---

## 🏗️ Arquitetura do Frontend

### **Component-Based Architecture**

O projeto segue os princípios de arquitetura baseada em componentes com separação clara de responsabilidades:

```
src/
├── components/          # 🧩 Componentes Reutilizáveis
│   ├── Layout.jsx      # Layout principal com navegação
│   ├── FilterPanel.jsx # Painel de filtros genérico
│   └── Pagination.jsx  # Componente de paginação
├── pages/              # 📄 Páginas da Aplicação
├── contexts/           # 🔄 Gerenciamento de Estado Global
├── services/           # 🌐 Camada de Serviços
├── App.jsx             # 🚦 Configuração de Rotas
└── main.jsx           # 🚀 Entry Point
```

---

## 📁 Estrutura Detalhada

### **Components** - Componentes Reutilizáveis

#### **Layout.jsx**
- Estrutura base da aplicação
- Navegação principal
- Menu lateral com links
- Header com informações do usuário
- Footer
- Responsivo (mobile-first)

**Características**:
- ✅ Exibe/esconde menu em mobile
- ✅ Logout integrado
- ✅ Informações do usuário logado
- ✅ Navegação condicional (rotas protegidas)

#### **FilterPanel.jsx**
- Painel de filtros genérico
- Campos configuráveis dinamicamente
- Botões de aplicar e limpar

**Props aceitas**:
```jsx
<FilterPanel
  filters={[
    { name: 'search', type: 'text', placeholder: 'Buscar...' },
    { name: 'type', type: 'select', options: [...] }
  ]}
  values={filterValues}
  onChange={handleFilterChange}
  onApply={handleApplyFilters}
  onClear={handleClearFilters}
/>
```

#### **Pagination.jsx**
- Paginação completa
- Exibição de informações (Total de X itens)
- Botões Anterior/Próximo
- Seletor de quantidade por página

**Props**:
```jsx
<Pagination
  currentPage={1}
  totalPages={10}
  pageSize={10}
  totalItems={100}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

---

### **Pages** - Páginas da Aplicação

#### **Autenticação**:
- `LoginPage.jsx` - Tela de login com JWT
- `RegisterPage.jsx` - Registro de novos usuários
- `ForgotPasswordPage.jsx` - Reset de senha via email
- `SettingsPage.jsx` - Alteração de senha e perfil

#### **Catalogação** (1ª Missão):
- `DronesPage.jsx` - CRUD de drones (Identificação + Combate)
- `SuperPowersPage.jsx` - CRUD de super poderes
- `PrimordialDucksPage.jsx` - CRUD de patos primordiais

**Funcionalidades Comuns**:
- ✅ Listagem com filtros
- ✅ Paginação
- ✅ Criação/Edição via modal
- ✅ Exclusão com confirmação
- ✅ Validação de formulários
- ✅ Feedback visual (toasts)

#### **Análise** (2ª Missão):
- `CaptureAnalysisPage.jsx` - Visualização de métricas de captura
  - 4 métricas principais (Custo, Poder Militar, Risco, Científico)
  - Score geral e classificação de prioridade
  - Gráficos e indicadores visuais
  
- `CaptureLogicPage.jsx` - Documentação da lógica de captura
  - Explicação detalhada de cada métrica
  - Fórmulas de cálculo
  - Estratégias e defesas

#### **Operação** (3ª Missão):
- `CaptureOperationPage.jsx` - CRUD de operações de captura
  - Criação de operações
  - Seleção de drone e pato
  - Estratégia e defesa geradas automaticamente
  - Taxa de sucesso calculada
  - Status da operação (Preparando, Em Andamento, Sucesso, Falha)

#### **Dashboard**:
- `DashboardPage.jsx` - Visão geral do sistema
  - Estatísticas gerais
  - Resumo de dados
  - Acesso rápido às funcionalidades

---

### **Contexts** - Gerenciamento de Estado

#### **AuthContext.jsx**
- Gerenciamento global de autenticação
- Armazenamento de token JWT no localStorage
- Informações do usuário logado
- Funções de login/logout
- Verificação de autenticação

**Uso**:
```jsx
import { useAuth } from './contexts/AuthContext';

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // ...
}
```

**Estado gerenciado**:
- `user` - Dados do usuário (id, email, role)
- `token` - JWT token
- `isAuthenticated` - Boolean
- `login(email, password)` - Função de login
- `logout()` - Função de logout

---

### **Services** - Camada de Serviços

#### **api.js**
- Configuração do Axios
- Interceptors para token JWT
- Base URL configurável via .env
- Tratamento de erros HTTP

**Configuração**:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### **authService.js**
- `login(email, password)` - Login de usuário
- `register(userData)` - Registro de novo usuário
- `forgotPassword(email)` - Solicita reset de senha
- `changePassword(oldPassword, newPassword)` - Altera senha

#### **droneService.js**
- `getDrones(filters, page, pageSize)` - Lista drones
- `getDroneById(id)` - Busca por ID
- `createDrone(data)` - Cria novo drone
- `updateDrone(id, data)` - Atualiza drone
- `deleteDrone(id)` - Remove drone

#### **primordialDuckService.js**
- CRUD completo de patos primordiais
- Filtros por hibernação, mutações, etc.

#### **superPowerService.js**
- CRUD completo de super poderes
- Filtros por classificação

#### **captureOperationService.js**
- CRUD completo de operações
- Análise de captura integrada

#### **emailService.js**
- Integração com EmailJS
- Envio de emails de reset de senha

**Configuração EmailJS**:
```javascript
emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  templateParams,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
```

---

## 🎨 Padrões de Design

### **Hooks Customizados**
- `useAuth()` - Hook de autenticação
- `usePagination()` - Hook de paginação
- `useFilters()` - Hook de filtros

### **Componentização**
- Componentes pequenos e focados
- Props tipadas via PropTypes (ou TypeScript no futuro)
- Reutilização máxima

### **Estado Local vs Global**
- **Global**: Autenticação (Context API)
- **Local**: Estado de formulários, filtros, paginação (useState)

### **Separação de Responsabilidades**
- **Pages**: Lógica de apresentação
- **Components**: UI reutilizável
- **Services**: Comunicação com API
- **Contexts**: Estado global

---

## 🚀 Como Executar

### **Opção 1: Docker (Recomendado)**

```bash
# Na raiz do projeto
docker-compose up -d

# Frontend estará em: http://localhost:3000
```

---

### **Opção 2: Desenvolvimento Local**

#### **Pré-requisitos**:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou yarn

#### **Passos**:

```bash
# 1. Navegue até a pasta do frontend
cd frontend/primordial-duck-frontend

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Configure as variáveis de ambiente
# Crie o arquivo .env.development na raiz do projeto frontend:

VITE_API_URL=http://localhost:7000/api
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key

# 4. Execute em modo desenvolvimento
npm run dev
# ou
yarn dev

# Frontend estará disponível em: http://localhost:5173
```

---

### **Build de Produção**

```bash
# 1. Build da aplicação
npm run build
# ou
yarn build

# Arquivos de produção estarão em: dist/

# 2. Preview do build localmente
npm run preview
# ou
yarn preview

# Preview estará em: http://localhost:4173
```

---

## 🔧 Configuração de Ambiente

### **Variáveis de Ambiente**

Crie os arquivos `.env.development` e `.env.production`:

```env
# URL da API backend
VITE_API_URL=http://localhost:7000/api

# Credenciais EmailJS
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxx
```

**Nota**: Variáveis devem começar com `VITE_` para serem expostas no build do Vite.

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Linting (ESLint)
npm run lint

# Formatação de código (Prettier)
npm run format
```

---

## 🎨 Estilização

### **CSS Modules**
- Cada componente/página tem seu próprio arquivo CSS
- Escopo isolado (sem conflitos de classe)
- Nomenclatura BEM (Block Element Modifier)

**Exemplo**:
```jsx
// DronesPage.jsx
import styles from './DronesPage.css';

<div className={styles.container}>
  <h1 className={styles.title}>Drones</h1>
</div>
```

```css
/* DronesPage.css */
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}
```

### **Variáveis CSS Globais**
- Definidas em `index.css`
- Cores, fontes, espaçamentos padronizados
- Tema consistente em toda aplicação

---

## 🌐 Integração com Backend

### **Autenticação JWT**
1. Login retorna token JWT
2. Token armazenado no localStorage
3. Token enviado em todas as requisições (header Authorization)
4. Logout remove token do localStorage

### **Tratamento de Erros**
- Interceptor Axios captura erros HTTP
- Redirecionamento automático em caso de 401 (não autenticado)
- Mensagens de erro exibidas via toast

### **Paginação**
- Query parameters: `?page=1&pageSize=10`
- Resposta: `{ items: [...], totalCount: 100 }`

### **Filtros**
- Query parameters dinâmicos: `?search=termo&type=Identification`

---

## 📊 Tecnologias e Bibliotecas

### **Core**
- **React 19.1.1** - Biblioteca UI
- **Vite 7.1.7** - Build tool e dev server

### **Roteamento**
- **React Router 7.9.4** - Roteamento SPA

### **HTTP Client**
- **Axios 1.7.9** - Requisições HTTP

### **Email**
- **EmailJS 4.4.1** - Envio de emails

### **Ícones**
- **Lucide React 0.468.0** - Ícones modernos

### **Estilização**
- CSS puro (sem framework)
- CSS Modules para escopo isolado

---

## 🎯 Boas Práticas Implementadas

- ✅ **Component-Based Architecture** - Componentes reutilizáveis
- ✅ **Context API** - Gerenciamento de estado global
- ✅ **Service Layer** - Separação de lógica de API
- ✅ **Environment Variables** - Configuração externa
- ✅ **Error Handling** - Tratamento robusto de erros
- ✅ **Loading States** - Feedback visual de carregamento
- ✅ **Form Validation** - Validação client-side
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Code Splitting** - Lazy loading de rotas (futuro)
- ✅ **Security** - XSS protection, token em header

---

## 🔐 Segurança

### **Proteção XSS**
- React escapa automaticamente strings
- Evita `dangerouslySetInnerHTML`

### **Token JWT**
- Armazenado no localStorage (alternativa: httpOnly cookies)
- Enviado apenas via header Authorization
- Não exposto em URLs

### **CORS**
- Backend configurado para aceitar origem do frontend

---

## 📱 Responsividade

- **Mobile First**: Design pensado primeiro para mobile
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Menu adaptativo**: Hamburguer em mobile, sidebar em desktop

---

## 🚀 Deploy

### **Nginx (Produção)**
- Arquivo `nginx.conf` incluído
- Suporte a SPA (fallback para index.html)
- Compressão gzip habilitada
- Cache de assets estáticos

### **Variáveis de Ambiente**
- Build args no Dockerfile
- `.env.production` para produção

---

## 📚 Estrutura de Rotas

```
/                           - Dashboard (protegido)
/login                      - Login
/register                   - Registro
/forgot-password            - Esqueci minha senha
/settings                   - Configurações (protegido)

/drones                     - Lista de drones (protegido)
/super-powers               - Lista de super poderes (protegido)
/primordial-ducks           - Lista de patos (protegido)

/capture-analysis           - Análise de captura (protegido)
/capture-logic              - Documentação da lógica (protegido)
/capture-operations         - Operações de captura (protegido)
```

**Rotas Protegidas**: Requerem autenticação JWT. Redirecionam para /login se não autenticado.

---

## 🧪 Testes (Futuro)

```bash
# Testes unitários com Vitest
npm run test

# Testes E2E com Playwright
npm run test:e2e

# Cobertura
npm run test:coverage
```

---

## 📚 Referências

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)

---

**Desenvolvido para o Dsin Coder Challenge 2025** 🦆