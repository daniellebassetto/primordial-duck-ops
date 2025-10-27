#!/bin/bash

# 🦆 Primordial Duck Operation - Azure VM Setup Script
# Este script configura automaticamente uma VM Linux para receber deploys

set -e

echo "🦆 Primordial Duck Operation - Azure VM Setup"
echo "=============================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Não execute este script como root!${NC}"
    echo "Execute: bash setup-azure-vm.sh"
    exit 1
fi

echo -e "${YELLOW}📋 Este script irá:${NC}"
echo "  1. Atualizar o sistema"
echo "  2. Instalar Docker e Docker Compose"
echo "  3. Configurar firewall básico"
echo "  4. Criar diretórios necessários"
echo "  5. Configurar permissões"
echo ""
read -p "Deseja continuar? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo -e "${GREEN}🔄 Atualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

echo ""
echo -e "${GREEN}🐳 Instalando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker instalado com sucesso${NC}"
else
    echo -e "${YELLOW}⚠️  Docker já está instalado${NC}"
fi

echo ""
echo -e "${GREEN}🔧 Instalando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose instalado com sucesso${NC}"
else
    echo -e "${YELLOW}⚠️  Docker Compose já está instalado${NC}"
fi

echo ""
echo -e "${GREEN}📁 Criando diretórios...${NC}"
sudo mkdir -p /opt/primordial-duck-operation
sudo chown $USER:$USER /opt/primordial-duck-operation
echo -e "${GREEN}✅ Diretório criado: /opt/primordial-duck-operation${NC}"

echo ""
echo -e "${GREEN}🔥 Configurando firewall...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw --force enable
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw allow 7000/tcp  # API
    sudo ufw status
    echo -e "${GREEN}✅ Firewall configurado${NC}"
else
    echo -e "${YELLOW}⚠️  UFW não está disponível, configure o firewall manualmente${NC}"
fi

echo ""
echo -e "${GREEN}📊 Verificando instalações...${NC}"
echo "Docker version:"
docker --version
echo ""
echo "Docker Compose version:"
docker-compose --version
echo ""

echo ""
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "  1. Você precisa fazer logout e login novamente para usar o Docker sem sudo"
echo "  2. Ou execute: newgrp docker"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "  1. Configure os secrets no GitHub (veja .github/workflows/README.md)"
echo "  2. Adicione sua chave SSH pública em ~/.ssh/authorized_keys"
echo "  3. Execute o workflow no GitHub Actions"
echo ""
echo -e "${GREEN}🦆 Informações da VM:${NC}"
echo "  IP Público: $(curl -s ifconfig.me)"
echo "  Hostname: $(hostname)"
echo "  Usuário: $USER"
echo "  Diretório de deploy: /opt/primordial-duck-operation"
echo ""

# Perguntar se quer reiniciar
read -p "Deseja reiniciar a VM agora para aplicar as mudanças? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔄 Reiniciando em 5 segundos...${NC}"
    sleep 5
    sudo reboot
fi
