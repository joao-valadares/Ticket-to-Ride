# 🔧 Guia de Solução de Problemas

## Problemas Comuns e Soluções

### 1. Erro ao Conectar ao Banco de Dados

**Problema:** `Error: connect ECONNREFUSED ::1:5432`

**Soluções:**

```powershell
# Verificar se o PostgreSQL está rodando
Get-Service postgresql*

# Iniciar o serviço
Start-Service postgresql-x64-14  # Ajuste a versão conforme instalado

# Verificar conexão
psql -U postgres -d tickettoride
```

Se ainda não funcionar, verifique o arquivo `.env`:
- Certifique-se que `DB_HOST=localhost` (não 127.0.0.1)
- Verifique usuário e senha
- Confirme que o banco `tickettoride` existe

### 2. Porta já em Uso

**Problema:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solução:**

```powershell
# Encontrar o processo usando a porta
netstat -ano | findstr :3001

# Matar o processo (substitua <PID> pelo número encontrado)
taskkill /PID <PID> /F
```

### 3. WebSocket não Conecta

**Problema:** Cliente não conecta ao servidor WebSocket

**Soluções:**
1. Verifique se o backend está rodando em `http://localhost:3001`
2. Abra o console do navegador (F12) e procure por erros
3. Verifique se o CORS está configurado corretamente
4. Tente limpar o cache do navegador

### 4. Módulos não Encontrados

**Problema:** `Error: Cannot find module '...'`

**Solução:**

```powershell
# No backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# No frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### 5. Build do Frontend Falha

**Problema:** Erro durante `npm run build`

**Soluções:**
1. Limpe o cache do Vite:
   ```powershell
   Remove-Item -Recurse -Force .vite
   Remove-Item -Recurse -Force dist
   ```
2. Reinstale dependências (ver problema 4)
3. Verifique se há erros de sintaxe nos arquivos JSX

### 6. Banco de Dados não Inicializa

**Problema:** Erro ao executar `init.sql`

**Solução:**

```powershell
# Recriar o banco do zero
psql -U postgres

# No psql:
DROP DATABASE IF EXISTS tickettoride;
CREATE DATABASE tickettoride;
\c tickettoride
\i C:/Users/Valadares/Documents/Faculdade/Projetos/Sonnet - Ticket to Ride - Projeto de Software/database/init.sql
```

## Comandos Úteis

### Backend

```powershell
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Verificar erros de sintaxe
node --check src/server.js
```

### Frontend

```powershell
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

### Banco de Dados

```powershell
# Conectar ao banco
psql -U postgres -d tickettoride

# Backup
pg_dump -U postgres tickettoride > backup.sql

# Restaurar backup
psql -U postgres -d tickettoride < backup.sql

# Ver todas as tabelas
psql -U postgres -d tickettoride -c "\dt"

# Ver dados de uma tabela
psql -U postgres -d tickettoride -c "SELECT * FROM players;"
```

## Logs e Debugging

### Habilitar Logs Detalhados

No `backend/src/server.js`, adicione:

```javascript
// Logs detalhados do Socket.IO
io.engine.on("connection_error", (err) => {
  console.error("Connection error:", err);
});

// Logs de todas as mensagens
io.on("connection", (socket) => {
  socket.onAny((event, ...args) => {
    console.log(`Event: ${event}`, args);
  });
});
```

### Ver Logs em Tempo Real

```powershell
# Logs do backend (se usando nodemon)
# Os logs já aparecem no terminal

# Logs do frontend
# Abra o DevTools do navegador (F12) > Console
```

## Performance e Otimização

### Se o Jogo Estiver Lento

1. **Reduzir Animações:**
   - Edite `frontend/src/index.css`
   - Remova ou diminua durações de animações

2. **Limitar Taxa de Atualização:**
   - No `GameController`, adicione throttling aos eventos

3. **Otimizar Renderizações:**
   - Use `React.memo()` nos componentes
   - Implemente `useMemo()` e `useCallback()`

## Resetar o Projeto

Se nada mais funcionar, reset completo:

```powershell
# 1. Limpar instalações
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

cd ../frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 2. Reinstalar tudo
cd ../backend
npm install

cd ../frontend
npm install

# 3. Resetar banco de dados
psql -U postgres -c "DROP DATABASE IF EXISTS tickettoride;"
psql -U postgres -c "CREATE DATABASE tickettoride;"
psql -U postgres -d tickettoride -f ../database/init.sql

# 4. Recriar .env
cd ../backend
copy .env.example .env
# Edite o .env com suas configurações

# 5. Testar
npm run dev  # no backend
# Em outro terminal:
cd ../frontend
npm run dev
```

## Verificação de Saúde do Sistema

Execute estes comandos para verificar se tudo está OK:

```powershell
# 1. Verificar Node.js
node --version  # Deve ser >= 16

# 2. Verificar npm
npm --version

# 3. Verificar PostgreSQL
psql --version  # Deve ser >= 12

# 4. Testar conexão ao banco
psql -U postgres -d tickettoride -c "SELECT NOW();"

# 5. Verificar portas disponíveis
netstat -ano | findstr :3000
netstat -ano | findstr :3001
# (Não deve retornar nada se as portas estiverem livres)
```

## Recursos Adicionais

- [Documentação do Node.js](https://nodejs.org/docs/)
- [Documentação do React](https://react.dev/)
- [Documentação do Socket.IO](https://socket.io/docs/)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)

---

Se você continuar com problemas após seguir este guia, considere:
1. Verificar os logs completos de erro
2. Buscar o erro específico online
3. Abrir uma issue no repositório com os detalhes completos
