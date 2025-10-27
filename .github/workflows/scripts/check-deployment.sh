#!/bin/bash

# Script para verificar status do deployment
# Uso: bash check-deployment.sh SEU_IP_DA_VM USUARIO

VM_HOST="${1:-}"
VM_USER="${2:-}"

if [ -z "$VM_HOST" ] || [ -z "$VM_USER" ]; then
    echo "Uso: bash check-deployment.sh IP_DA_VM USUARIO"
    echo "Exemplo: bash check-deployment.sh 20.123.45.67 azureuser"
    exit 1
fi

echo "🔍 Verificando deployment em $VM_HOST..."
echo ""

ssh "$VM_USER@$VM_HOST" << 'ENDSSH'
echo "=== 📊 Status dos Containers ==="
docker ps -a
echo ""

echo "=== 🐳 Docker Compose Status ==="
cd /opt/primordial-duck-operation
docker-compose ps
echo ""

echo "=== 📝 Últimos 20 logs da API ==="
docker logs --tail=20 pdo-api
echo ""

echo "=== 📝 Últimos 20 logs do Frontend ==="
docker logs --tail=20 pdo-frontend
echo ""

echo "=== 📝 Últimos 20 logs do MySQL ==="
docker logs --tail=20 pdo-mysql
echo ""

echo "=== 💾 Uso de Recursos ==="
docker stats --no-stream
echo ""

echo "=== 💽 Espaço em Disco ==="
df -h /
echo ""

echo "=== 🔌 Portas em Uso ==="
sudo netstat -tlnp | grep -E ':(80|443|7000|3307)'
echo ""

echo "✅ Verificação concluída!"
ENDSSH
