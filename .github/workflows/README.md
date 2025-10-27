# 🚀 GitHub Actions - Deploy para Azure VM Linux

Este workflow automatiza o deploy completo da aplicação Primordial Duck Operation em uma VM Linux na Azure.

## 📋 Pré-requisitos

### 1. Azure VM Linux
- Sistema Operacional: Ubuntu 20.04 LTS ou superior
- Recursos mínimos: B1ms (1 vCPU, 2 GB RAM) ou superior
- Docker e Docker Compose instalados
- Porta 22 (SSH) aberta para GitHub Actions
- Portas 80, 443, 7000 abertas para a aplicação

### 2. Configuração da VM

Execute na sua VM Azure:

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Criar diretório para a aplicação
sudo mkdir -p /opt/primordial-duck-operation
sudo chown $USER:$USER /opt/primordial-duck-operation

# Reiniciar para aplicar mudanças do Docker
sudo reboot
```

### 3. Gerar Chave SSH

Na sua máquina local:

```bash
# Gerar par de chaves SSH (se ainda não tiver)
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/azure_vm_deploy

# Copiar chave pública para a VM
ssh-copy-id -i ~/.ssh/azure_vm_deploy.pub usuario@IP_DA_VM

# Exibir chave privada (será usada como secret)
cat ~/.ssh/azure_vm_deploy
```

## 🔐 Configurar Secrets no GitHub

Vá em **Settings > Secrets and variables > Actions** e adicione os seguintes secrets:

### Secrets Obrigatórios:

#### **Conexão Azure VM**
- `AZURE_VM_HOST` - IP público ou DNS da VM Azure (ex: `20.123.45.67`)
- `AZURE_VM_USERNAME` - Usuário SSH da VM (ex: `azureuser`)
- `AZURE_VM_SSH_KEY` - Conteúdo completo da chave privada SSH (arquivo gerado acima)
- `AZURE_VM_SSH_PORT` - Porta SSH (padrão: `22`)

#### **Banco de Dados MySQL**
- `MYSQL_ROOT_PASSWORD` - Senha do root do MySQL (ex: `primordial@duck2025`)
- `MYSQL_DATABASE` - Nome do banco de dados (ex: `primordial_duck_operation`)

#### **JWT Authentication**
- `JWT_SECRET` - Chave secreta para JWT (gere uma string aleatória forte)
- `JWT_ISSUER` - Emissor do token (ex: `PrimordialDuckOperation`)
- `JWT_AUDIENCE` - Audiência do token (ex: `PrimordialDuckOperationUsers`)
- `JWT_EXPIRATION_MINUTES` - Tempo de expiração em minutos (ex: `60`)

#### **Frontend - EmailJS**
- `VITE_API_URL` - URL da API (ex: `http://IP_DA_VM:7000/api`)
- `VITE_EMAILJS_SERVICE_ID` - Service ID do EmailJS
- `VITE_EMAILJS_TEMPLATE_ID` - Template ID do EmailJS
- `VITE_EMAILJS_PUBLIC_KEY` - Public Key do EmailJS

### Exemplo de valores:

```bash
# Azure VM
AZURE_VM_HOST=20.123.45.67
AZURE_VM_USERNAME=azureuser
AZURE_VM_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmF...
(conteúdo completo da chave privada)
...
-----END OPENSSH PRIVATE KEY-----
AZURE_VM_SSH_PORT=22

# Database
MYSQL_ROOT_PASSWORD=Pr1m0rd14l@Duck!2025
MYSQL_DATABASE=primordial_duck_operation

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-characters-long-and-random
JWT_ISSUER=PrimordialDuckOperation
JWT_AUDIENCE=PrimordialDuckOperationUsers
JWT_EXPIRATION_MINUTES=60

# Frontend
VITE_API_URL=http://20.123.45.67:7000/api
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

## 🎯 Como Funciona o Workflow

### Pipeline de Deploy (3 Jobs):

#### 1. **Build and Push** 
- Faz build das imagens Docker (Backend .NET 9 + Frontend React)
- Publica as imagens no GitHub Container Registry (ghcr.io)
- Usa cache para otimizar builds subsequentes

#### 2. **Deploy**
- Copia arquivos de configuração para a VM
- Faz login no registry e pull das imagens
- Para containers antigos
- Inicia novos containers com docker-compose
- Executa health checks

#### 3. **Cleanup**
- Remove versões antigas de imagens não utilizadas
- Mantém as 5 versões mais recentes

## 🔄 Triggers do Workflow

O deploy é executado automaticamente quando:
- **Push na branch `main`** - Deploy automático
- **Manual** - Via botão "Run workflow" na aba Actions

## 📊 Estrutura do Deploy

```
/opt/primordial-duck-operation/
├── docker-compose.yml          # Configuração dos containers
└── mysql_data/                 # Volume persistente do MySQL
```

### Containers Criados:

| Container | Porta | Recursos |
|-----------|-------|----------|
| `pdo-mysql` | 3307:3306 | 512MB RAM |
| `pdo-api` | 7000:8080 | 512MB RAM |
| `pdo-frontend` | 80:80, 443:443 | 256MB RAM |

## 🏥 Health Checks

O workflow verifica automaticamente:
- ✅ API está respondendo na porta 7000
- ✅ Frontend está acessível na porta 80
- ✅ Containers estão rodando corretamente

## 🔍 Monitoramento

### Ver logs dos containers na VM:

```bash
# Conectar na VM
ssh usuario@IP_DA_VM

# Ver status dos containers
cd /opt/primordial-duck-operation
docker-compose ps

# Ver logs
docker-compose logs -f              # Todos os serviços
docker-compose logs -f api          # Apenas API
docker-compose logs -f frontend     # Apenas Frontend
docker-compose logs -f mysql        # Apenas MySQL

# Ver recursos utilizados
docker stats
```

### Acessar a aplicação:

- **Frontend**: `http://IP_DA_VM`
- **API**: `http://IP_DA_VM:7000`
- **Swagger**: `http://IP_DA_VM:7000/swagger`

## 🛠️ Comandos Úteis na VM

```bash
# Reiniciar todos os serviços
cd /opt/primordial-duck-operation
docker-compose restart

# Parar todos os serviços
docker-compose down

# Iniciar todos os serviços
docker-compose up -d

# Atualizar para última versão (manual)
docker-compose pull
docker-compose up -d

# Ver logs de um serviço específico
docker-compose logs -f api

# Executar comando dentro de um container
docker-compose exec api bash

# Limpar recursos não utilizados
docker system prune -a --volumes
```

## 🔒 Segurança

### Recomendações:

1. **Firewall**: Configure NSG (Network Security Group) na Azure
   - Permitir porta 22 apenas de IPs confiáveis
   - Permitir portas 80/443 para todos
   - Permitir porta 7000 conforme necessário

2. **SSL/TLS**: Configure certificado HTTPS
   ```bash
   # Instalar Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obter certificado (configurar domínio primeiro)
   sudo certbot --nginx -d seudominio.com
   ```

3. **Secrets**: Nunca commite secrets no código
   - Use GitHub Secrets para variáveis sensíveis
   - Rotacione senhas periodicamente

4. **Updates**: Mantenha a VM atualizada
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## 🐛 Troubleshooting

### Deploy falhou?

1. **Verificar secrets**: Todos os secrets estão configurados?
2. **Verificar VM**: SSH está acessível? Docker está instalado?
3. **Verificar logs**: Actions > workflow run > ver logs detalhados
4. **Verificar portas**: NSG permite conexões nas portas necessárias?

### Containers não iniciam?

```bash
# Ver logs detalhados
docker-compose logs

# Verificar recursos
docker stats
free -h
df -h

# Reiniciar Docker
sudo systemctl restart docker
docker-compose up -d
```

### Banco de dados com problemas?

```bash
# Acessar MySQL
docker-compose exec mysql mysql -u root -p

# Verificar databases
SHOW DATABASES;
USE primordial_duck_operation;
SHOW TABLES;
```

## 📝 Notas Importantes

- O workflow usa **GitHub Container Registry** (ghcr.io) - gratuito para repositórios públicos
- Imagens Docker são buildadas em cada push para `main`
- O deploy é feito apenas após build bem-sucedido
- Health checks garantem que a aplicação está funcionando antes de concluir
- Cleanup automático remove imagens antigas para economizar espaço

## 🚀 Próximos Passos

Após configurar o workflow:

1. ✅ Configure todos os secrets no GitHub
2. ✅ Prepare a VM Azure com Docker
3. ✅ Adicione a chave SSH à VM
4. ✅ Faça um push para `main` ou execute manualmente
5. ✅ Monitore o workflow na aba Actions
6. ✅ Acesse a aplicação no IP da VM

---

**Desenvolvido para o desafio Dsin Coder Challenge 2025** 🦆
