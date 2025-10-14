# 🚀 Quick Start Guide

## Configuração Inicial (Execute apenas uma vez)

### 1. Instalar Dependências

```powershell
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 2. Configurar Banco de Dados

```powershell
# Criar banco
psql -U postgres -c "CREATE DATABASE tickettoride;"

# Executar script de inicialização
psql -U postgres -d tickettoride -f database/init.sql
```

### 3. Configurar Variáveis de Ambiente

```powershell
cd backend
copy .env.example .env
# Edite o .env com suas credenciais do PostgreSQL
```

---

## Executar o Projeto (Diariamente)

### Opção 1: Manualmente (3 terminais)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Terminal 3 - Verificar PostgreSQL:**
```powershell
# Verificar se está rodando
Get-Service postgresql*

# Iniciar se necessário
Start-Service postgresql-x64-14
```

### Opção 2: Usando Scripts (Windows)

Crie um arquivo `start-dev.bat` na raiz do projeto:

```batch
@echo off
echo Iniciando Ticket to Ride - Brasil...

REM Verificar PostgreSQL
echo Verificando PostgreSQL...
net start postgresql-x64-14

REM Iniciar Backend
echo Iniciando Backend...
start cmd /k "cd backend && npm run dev"

REM Aguardar 3 segundos
timeout /t 3

REM Iniciar Frontend
echo Iniciando Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo Servidor Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo ================================
echo.
echo Pressione qualquer tecla para sair...
pause > nul
```

Execute: `.\start-dev.bat`

---

## Acessar o Jogo

1. Abra seu navegador em: **http://localhost:3000**
2. Digite seu nome
3. Clique em "Criar Novo Jogo"
4. Compartilhe o código com amigos
5. Quando todos estiverem prontos, clique em "Iniciar Jogo"

---

## Parar o Projeto

1. Pressione `Ctrl + C` em cada terminal
2. Confirme com `S` (Sim)

Ou se usou o script .bat, apenas feche as janelas.

---

## Comandos Úteis

### Verificar Status

```powershell
# Verificar se as portas estão em uso
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Verificar PostgreSQL
Get-Service postgresql*

# Testar conexão ao banco
psql -U postgres -d tickettoride -c "SELECT NOW();"
```

### Resetar Dados do Jogo

```powershell
# Limpar todas as partidas
psql -U postgres -d tickettoride -c "TRUNCATE games, game_players, claimed_routes, destination_tickets CASCADE;"

# Resetar estatísticas
psql -U postgres -d tickettoride -c "UPDATE player_stats SET total_games=0, total_wins=0, total_score=0;"
```

### Limpar Cache

```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .vite
npm install
```

---

## Atalhos do Navegador

- **F12** - Abrir DevTools (ver logs e erros)
- **Ctrl + Shift + R** - Recarregar página (limpar cache)
- **F5** - Recarregar página normal

---

## Checklist Antes de Jogar

- [ ] PostgreSQL está rodando?
- [ ] Backend iniciado sem erros?
- [ ] Frontend acessível em http://localhost:3000?
- [ ] Console do navegador sem erros críticos?
- [ ] Arquivo `.env` configurado corretamente?

---

## Próximos Passos

1. ✅ Configuração concluída
2. 🎮 Jogue algumas partidas de teste
3. 📖 Leia o README.md para entender as regras
4. 🐛 Se tiver problemas, veja TROUBLESHOOTING.md
5. 📡 Para integração, veja API.md

---

## Links Rápidos

- **Jogo:** http://localhost:3000
- **API Health:** http://localhost:3001/api/health
- **API Games:** http://localhost:3001/api/games

---

**Divirta-se jogando! 🚂🎮**
