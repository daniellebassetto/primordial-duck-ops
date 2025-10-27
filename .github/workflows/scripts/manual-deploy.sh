#!/bin/bash

# 🦆 Manual Deploy Script for Azure VM
# Use este script para fazer deploy manual em caso de problemas com o GitHub Actions

set -e

# Configurações - EDITE ESTAS VARIÁVEIS
VM_HOST="${AZURE_VM_HOST:-}"
VM_USER="${AZURE_VM_USER:-}"
SSH_KEY_PATH="${SSH_KEY_PATH:-~/.ssh/azure_vm_deploy}"
PROJECT_DIR="/opt/primordial-duck-operation"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🦆 Primordial Duck Operation - Manual Deploy     ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar variáveis
if [ -z "$VM_HOST" ]; then
    read -p "Digite o IP ou hostname da VM: " VM_HOST
fi

if [ -z "$VM_USER" ]; then
    read -p "Digite o usuário SSH: " VM_USER
fi

echo ""
echo -e "${YELLOW}📋 Configurações:${NC}"
echo "  VM Host: $VM_HOST"
echo "  VM User: $VM_USER"
echo "  SSH Key: $SSH_KEY_PATH"
echo "  Project Dir: $PROJECT_DIR"
echo ""

read -p "Continuar com estas configurações? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Função para executar comandos remotos
ssh_exec() {
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" "$@"
}

# Função para copiar arquivos
scp_copy() {
    scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$@"
}

echo ""
echo -e "${GREEN}🔍 Testando conexão SSH...${NC}"
if ssh_exec "echo 'Conexão bem-sucedida!'" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexão SSH OK${NC}"
else
    echo -e "${RED}❌ Falha na conexão SSH${NC}"
    echo "Verifique se a chave SSH está correta e se o servidor está acessível"
    exit 1
fi

echo ""
echo -e "${GREEN}🐳 Verificando Docker na VM...${NC}"
if ssh_exec "command -v docker" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker encontrado${NC}"
    ssh_exec "docker --version"
else
    echo -e "${RED}❌ Docker não está instalado${NC}"
    echo "Execute o script setup-azure-vm.sh na VM primeiro"
    exit 1
fi

echo ""
echo -e "${GREEN}📦 Construindo imagens Docker localmente...${NC}"

# Build backend
echo -e "${BLUE}Building backend...${NC}"
docker build -t primordial-duck-backend:latest ./backend

# Build frontend
echo -e "${BLUE}Building frontend...${NC}"
docker build -t primordial-duck-frontend:latest ./frontend/primordial-duck-frontend

echo ""
echo -e "${GREEN}💾 Salvando imagens Docker...${NC}"
docker save primordial-duck-backend:latest | gzip > /tmp/backend-image.tar.gz
docker save primordial-duck-frontend:latest | gzip > /tmp/frontend-image.tar.gz

echo ""
echo -e "${GREEN}📤 Transferindo imagens para a VM...${NC}"
echo "Isso pode levar alguns minutos..."

scp_copy /tmp/backend-image.tar.gz "$VM_USER@$VM_HOST:/tmp/"
scp_copy /tmp/frontend-image.tar.gz "$VM_USER@$VM_HOST:/tmp/"

echo ""
echo -e "${GREEN}📥 Carregando imagens na VM...${NC}"
ssh_exec "docker load < /tmp/backend-image.tar.gz"
ssh_exec "docker load < /tmp/frontend-image.tar.gz"

echo ""
echo -e "${GREEN}📝 Criando docker-compose.yml...${NC}"

# Criar docker-compose temporário
cat > /tmp/docker-compose.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: pdo-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-primordial@duck2025}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-primordial_duck_operation}
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - pdo-network
    command: --default-authentication-plugin=mysql_native_password --max_connections=50 --innodb_buffer_pool_size=128M
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD:-primordial@duck2025}"]
      timeout: 20s
      retries: 10
      interval: 10s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  api:
    image: primordial-duck-backend:latest
    container_name: pdo-api
    ports:
      - "7000:8080"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:8080
      - ConnectionStrings__DefaultConnection=Server=mysql;Database=${MYSQL_DATABASE:-primordial_duck_operation};User=root;Password=${MYSQL_ROOT_PASSWORD:-primordial@duck2025};
    networks:
      - pdo-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  frontend:
    image: primordial-duck-frontend:latest
    container_name: pdo-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    networks:
      - pdo-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

networks:
  pdo-network:
    driver: bridge

volumes:
  mysql_data:
EOF

# Copiar docker-compose para a VM
scp_copy /tmp/docker-compose.yml "$VM_USER@$VM_HOST:$PROJECT_DIR/"

echo ""
echo -e "${GREEN}🔄 Parando containers antigos...${NC}"
ssh_exec "cd $PROJECT_DIR && docker-compose down || true"

echo ""
echo -e "${GREEN}🚀 Iniciando novos containers...${NC}"
ssh_exec "cd $PROJECT_DIR && docker-compose up -d"

echo ""
echo -e "${GREEN}⏳ Aguardando serviços iniciarem...${NC}"
sleep 15

echo ""
echo -e "${GREEN}📊 Status dos containers:${NC}"
ssh_exec "cd $PROJECT_DIR && docker-compose ps"

echo ""
echo -e "${GREEN}🧹 Limpando arquivos temporários...${NC}"
rm -f /tmp/backend-image.tar.gz /tmp/frontend-image.tar.gz /tmp/docker-compose.yml
ssh_exec "rm -f /tmp/backend-image.tar.gz /tmp/frontend-image.tar.gz"

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo -e "${YELLOW}📱 URLs da aplicação:${NC}"
echo "  Frontend: http://$VM_HOST"
echo "  API: http://$VM_HOST:7000"
echo "  Swagger: http://$VM_HOST:7000/swagger"
echo ""
echo -e "${YELLOW}📋 Comandos úteis:${NC}"
echo "  Ver logs: ssh $VM_USER@$VM_HOST 'cd $PROJECT_DIR && docker-compose logs -f'"
echo "  Status: ssh $VM_USER@$VM_HOST 'cd $PROJECT_DIR && docker-compose ps'"
echo "  Reiniciar: ssh $VM_USER@$VM_HOST 'cd $PROJECT_DIR && docker-compose restart'"
echo ""
echo -e "${GREEN}🦆 Primordial Duck Operation deployed successfully!${NC}"
