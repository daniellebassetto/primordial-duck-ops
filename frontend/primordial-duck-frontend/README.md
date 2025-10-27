# 🎨 Frontend - Primordial Duck Operation

Interface web moderna construída com **React 19** e **Vite 7** para gerenciamento completo do sistema de catalogação e captura de Patos Primordiais.

---

## Acesso à Aplicação

### **Ambiente de Produção**
- **Interface Web**: http://172.172.122.181:8080

### **Ambiente Local**
- **Desenvolvimento (Vite)**: http://localhost:3000
- **Docker (desenvolvimento)**: http://localhost:3000
- **Preview Build**: http://localhost:4173

---

## 🏗️ Arquitetura do Frontend

### **Component-Based Architecture**

O projeto segue os princípios de arquitetura baseada em componentes com separação clara de responsabilidades e organização modular.

**Princípios Aplicados**:
- ✅ Componentização e Reutilização
- ✅ Separação de Responsabilidades (SoC)
- ✅ State Management com Context API
- ✅ Service Layer para comunicação com API
- ✅ Custom Hooks para lógica compartilhada
- ✅ Atomic Design Pattern

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

## 🚀 Como Executar o Frontend

### **Opção 1: Acessar Aplicação em Produção**

Acesse diretamente a interface web:
- **URL**: http://172.172.122.181:8080/

### **Opção 2: Docker**

```bash
# Na raiz do projeto
docker-compose up -d frontend

# Verificar logs
docker logs -f pdo-frontend
```

**Frontend estará em**: http://localhost:3000


### **Opção 3: Desenvolvimento Local**

**Pré-requisitos**:
- Node.js 18+ instalado
- npm ou yarn

**Passos**:

```bash
# 1. Navegar para a pasta do frontend
cd frontend/primordial-duck-frontend

# 2. Instalar dependências
npm install
# ou
yarn install

# 3. Configurar variáveis de ambiente (opcional)
# Criar arquivo .env.local na raiz:
# VITE_API_URL=http://localhost:7000/api

# 4. Executar em modo desenvolvimento
npm run dev
# ou
yarn dev

# 5. Acessar aplicação
# URL: http://localhost:3000
```

**Build para Produção**:

```bash
# Gerar build otimizado
npm run build
# ou
yarn build

# Visualizar build localmente
npm run preview
# ou
yarn preview
```

---

## 🚀 Como Executar

### **Modo Desenvolvimento**

```bash
# 1. Instale as dependências
npm install
# ou
yarn install

# 2. Execute em modo desenvolvimento
npm run dev
# ou
yarn dev
```

**Frontend estará disponível em**: http://localhost:3000

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
- **React 19.1.1** - Biblioteca UI moderna com Hooks
- **Vite 7.1.7** - Build tool ultra-rápido e dev server

### **Roteamento**
- **React Router 7.9.4** - Roteamento SPA com lazy loading

### **HTTP Client**
- **Axios 1.7.9** - Requisições HTTP com interceptors

### **Email**
- **EmailJS 4.4.1** - Envio de emails sem backend dedicado

### **Ícones**
- **Lucide React 0.468.0** - Biblioteca de ícones SVG moderna

### **Estilização**
- CSS puro com variáveis CSS
- CSS Modules para escopo isolado de componentes
- Design responsivo mobile-first

---

## 📁 Estrutura de Organização

### **Por Funcionalidade**

```
src/
├── components/           # Componentes reutilizáveis (atoms/molecules)
│   ├── Layout.jsx       # Shell da aplicação
│   ├── FilterPanel.jsx  # Sistema de filtros
│   └── Pagination.jsx   # Paginação
├── pages/               # Páginas completas (organisms/templates)
│   ├── auth/           # Autenticação
│   ├── drones/         # Gestão de drones
│   ├── primordial-ducks/ # Gestão de patos
│   ├── super-powers/   # Gestão de poderes
│   ├── capture/        # Operações de captura
│   └── dashboard/      # Dashboard principal
├── contexts/            # Estado global (AuthContext)
├── services/            # Camada de comunicação API
│   ├── api.js          # Instância Axios configurada
│   ├── auth.service.js # Endpoints de autenticação
│   └── *.service.js    # Serviços especializados
├── utils/               # Funções utilitárias
├── assets/              # Imagens, fontes, etc
├── App.jsx              # Configuração de rotas
└── main.jsx            # Entry point da aplicação
```

### **Padrão de Nomenclatura**
- **Componentes**: PascalCase (ex: `PrimordialDuckForm.jsx`)
- **Services**: camelCase com sufixo (ex: `drone.service.js`)
- **Páginas**: PascalCase com sufixo Page (ex: `DronesPage.jsx`)
- **Contextos**: PascalCase com sufixo Context (ex: `AuthContext.jsx`)

---

## 🎯 Boas Práticas Implementadas

### **Arquitetura**
- ✅ **Component-Based Architecture** - Componentes reutilizáveis e isolados
- ✅ **Context API** - Gerenciamento de estado global sem bibliotecas externas
- ✅ **Service Layer** - Separação clara entre UI e lógica de API
- ✅ **Custom Hooks** - Lógica compartilhada (useAuth)
- ✅ **Atomic Design** - Organização de componentes por complexidade

### **Código**
- ✅ **Single Responsibility** - Um componente, uma responsabilidade
- ✅ **DRY (Don't Repeat Yourself)** - Reutilização de código
- ✅ **Composition over Inheritance** - Composição de componentes
- ✅ **Props Validation** - Validação de propriedades (PropTypes)
- ✅ **Error Boundaries** - Tratamento de erros em componentes

### **Performance**
- ✅ **Code Splitting** - Carregamento sob demanda de rotas
- ✅ **Lazy Loading** - Componentes carregados quando necessários
- ✅ **Memoization** - useMemo e useCallback quando apropriado
- ✅ **Debounce** - Em buscas e filtros

### **UX/UI**
- ✅ **Loading States** - Feedback visual durante requisições
- ✅ **Error Handling** - Mensagens de erro amigáveis
- ✅ **Form Validation** - Validação client-side antes de enviar
- ✅ **Responsive Design** - Adaptação para todos os tamanhos de tela
- ✅ **Accessibility** - Semantic HTML e ARIA labels

---

## 🔐 Segurança

### **Proteção XSS (Cross-Site Scripting)**
- React escapa automaticamente strings renderizadas
- Evita uso de `dangerouslySetInnerHTML`
- Sanitização de inputs do usuário

### **Autenticação JWT**
- Token armazenado no localStorage
- Enviado exclusivamente via header `Authorization: Bearer {token}`
- Nunca exposto em URLs ou query parameters
- Logout limpa tokens do storage

### **CORS (Cross-Origin Resource Sharing)**
- Backend configurado para aceitar apenas origens confiáveis
- Requisições incluem credenciais quando necessário

### **Validação de Dados**
- Validação client-side em formulários
- Re-validação server-side na API
- Prevenção de SQL Injection (handled by backend ORM)

---

## 📱 Responsividade

### **Mobile First Approach**
- Design pensado primeiro para dispositivos móveis
- Progressive enhancement para telas maiores

### **Breakpoints**
```css
/* Mobile (padrão) */
@media (max-width: 767px) { ... }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large Desktop */
@media (min-width: 1440px) { ... }
```

### **Componentes Adaptativos**
- **Menu**: Hamburguer em mobile, sidebar fixa em desktop
- **Tabelas**: Scroll horizontal em mobile, visualização completa em desktop
- **Formulários**: Uma coluna em mobile, múltiplas colunas em desktop
- **Modais**: Fullscreen em mobile, centralizado em desktop

---

## 🚀 Deploy e Produção

### **Build de Produção**

```bash
# Gerar build otimizado
npm run build

# Resultado em: dist/
# - HTML minificado
# - CSS extraído e minificado
# - JS bundled e minificado
# - Assets otimizados
# - Source maps (opcional)
```

### **Nginx (Servidor Web)**

Arquivo `nginx.conf` incluído no projeto:

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # SPA: redirecionar todas rotas para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Compressão gzip
    gzip on;
    gzip_types text/css application/javascript;
}
```

### **Docker**

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Variáveis de Ambiente**

**Desenvolvimento** (`.env.local`):
```env
VITE_API_URL=http://localhost:7000/api
```

**Produção** (`.env.production`):
```env
VITE_API_URL=http://172.172.122.181:7000/api
```
---

## 📚 Referências e Recursos

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Lucide Icons](https://lucide.dev/)

---

**Desenvolvido para o Dsin Coder Challenge 2025** 🦆

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

## 📚 Referências

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)

---

**Desenvolvido para o Dsin Coder Challenge 2025** 🦆
