# 🎮 Como Jogar com Múltiplas Abas (Teste Local)

## Passo a Passo para Testar o Jogo

### 1️⃣ **Primeira Aba - Criar o Jogo (HOST)**

1. Abra o navegador em `http://localhost:3000`
2. Digite seu nome (ex: "Jogador 1")
3. Clique em **"Criar Novo Jogo"**
4. Você será redirecionado para a sala de espera
5. **Copie o código de 6 dígitos** que aparece (ex: "ABC123")
6. Você verá o botão **"Iniciar Jogo"** (mas não clique ainda!)

### 2️⃣ **Segunda Aba - Entrar no Jogo**

1. **Abra uma NOVA aba** no mesmo navegador (Ctrl + T)
2. Acesse `http://localhost:3000` novamente
3. Digite um nome diferente (ex: "Jogador 2")
4. Clique em **"Entrar em um jogo existente"**
5. Digite o código que você copiou (ex: "ABC123")
6. Clique em **"Entrar no Jogo"**
7. Você verá a mensagem **"Aguardando o host iniciar o jogo..."**

### 3️⃣ **Terceira Aba (Opcional) - Mais Jogadores**

Repita o passo 2 para adicionar mais jogadores (até 5 no total).

### 4️⃣ **Voltar para a Primeira Aba - Iniciar o Jogo**

1. Volte para a **primeira aba** (onde você criou o jogo)
2. Você verá todos os jogadores listados
3. Clique em **"Iniciar Jogo"**
4. O jogo começará em TODAS as abas simultaneamente!

---

## 🎯 Exemplo Completo

```
ABA 1 (Host):
├── Nome: "João"
├── Ação: Criar Novo Jogo
├── Código gerado: "XYZ789"
└── STATUS: Pode iniciar o jogo ✅

ABA 2:
├── Nome: "Maria"
├── Ação: Entrar no Jogo
├── Código digitado: "XYZ789"
└── STATUS: Aguardando host 🕐

ABA 3:
├── Nome: "Pedro"
├── Ação: Entrar no Jogo
├── Código digitado: "XYZ789"
└── STATUS: Aguardando host 🕐

ABA 1 (Host):
└── CLICA em "Iniciar Jogo" 🚀

TODAS AS ABAS:
└── Jogo inicia! 🎮
```

---

## ⚠️ Problemas Comuns

### "Aguardando o host" em todas as abas

**Causa:** Você entrou em um jogo que não existe ou o host fechou a aba.

**Solução:**
1. Volte ao menu principal
2. Na primeira aba, clique em "Criar Novo Jogo"
3. Nas outras abas, clique em "Entrar em um jogo existente"

### Não consigo ver o botão "Iniciar Jogo"

**Causa:** Você não é o host (primeira aba que criou o jogo).

**Solução:**
1. Volte para a primeira aba (onde você clicou em "Criar Novo Jogo")
2. Lá você verá o botão verde "Iniciar Jogo"

### O jogo não inicia

**Causa:** Menos de 2 jogadores conectados.

**Solução:**
1. Você precisa de pelo menos 2 jogadores
2. Abra uma segunda aba e entre no jogo
3. Volte para a primeira aba e clique em "Iniciar Jogo"

### "Jogo não encontrado"

**Causa:** O código está errado ou o host fechou a sala.

**Solução:**
1. Verifique se digitou o código corretamente
2. Confirme que a aba do host ainda está aberta
3. Se necessário, crie um novo jogo

---

## 🔧 Verificações Técnicas

### Backend rodando?
```powershell
# Verifique se há mensagens de erro no terminal do backend
# Deve mostrar: "Servidor rodando na porta 3001"
```

### Frontend acessível?
```
Abra: http://localhost:3000
Deve carregar a tela do menu principal
```

### WebSocket conectado?
```
Abra DevTools (F12) > Console
Procure por: "Conectado ao servidor: <socket-id>"
```

---

## 📹 Fluxo Visual

```
┌─────────────────────────────────────────┐
│  ABA 1: http://localhost:3000           │
│  ┌────────────────────────────────┐    │
│  │  Digite seu nome: João          │    │
│  │  [Criar Novo Jogo]              │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ABA 1: http://localhost:3000/lobby/... │
│  ┌────────────────────────────────┐    │
│  │  Código: ABC123  [📋 Copiar]   │    │
│  │  Jogadores (1/5):              │    │
│  │  • João (HOST)                 │    │
│  │  [Iniciar Jogo] [Sair]         │    │ ← BOTÃO APARECE AQUI!
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ABA 2: http://localhost:3000 (Nova)    │
│  ┌────────────────────────────────┐    │
│  │  Digite seu nome: Maria         │    │
│  │  Código do jogo: ABC123         │    │
│  │  [Entrar no Jogo]               │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ABA 2: http://localhost:3000/lobby/... │
│  ┌────────────────────────────────┐    │
│  │  Código: ABC123                │    │
│  │  Jogadores (2/5):              │    │
│  │  • João (HOST)                 │    │
│  │  • Maria                       │    │
│  │  Aguardando o host...          │    │ ← SEM BOTÃO AQUI
│  │  [Sair]                        │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 🎉 Sucesso!

Quando você clicar em "Iniciar Jogo" na primeira aba, todas as abas serão redirecionadas para a tela do jogo e você poderá jogar!

---

**Dica:** Mantenha as abas lado a lado para facilitar o teste!
