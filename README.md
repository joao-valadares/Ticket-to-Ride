# 🚂 Ticket to Ride - Brasil

Um jogo de estratégia web multiplayer inspirado no clássico jogo de tabuleiro "Ticket to Ride", ambientado no mapa do Brasil.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## � DOCUMENTAÇÃO COMPLETA

### **📖 Para Jogadores**
- [**📕 REGRAS DO JOGO**](REGRAS_DO_JOGO.md) - Guia completo: como jogar, tipos de cartas, pontuação, estratégias

### **🔧 Para Desenvolvedores**
- [**⚡ QUICKSTART**](QUICKSTART.md) - Como iniciar o projeto rapidamente
- [**🗺️ AJUSTE DE ROTAS**](AJUSTE_ROTAS.md) - Como adicionar/modificar cidades e rotas
- [**🎨 CORES REFERÊNCIA**](CORES_REFERENCIA.md) - Referência rápida de cores e rotas
- [**📡 API**](API.md) - Documentação completa da API e eventos Socket.IO
- [**🔍 TROUBLESHOOTING**](TROUBLESHOOTING.md) - Soluções para problemas comuns
- [**📊 IMPLEMENTAÇÃO**](IMPLEMENTATION_SUMMARY.md) - Visão técnica do projeto
- [**🧪 TESTE MÚLTIPLAS ABAS**](TESTE_MULTIPLAS_ABAS.md) - Como testar multiplayer

---

## �📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Características](#características)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Como Jogar](#como-jogar)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autores](#autores)

## 🎮 Sobre o Projeto

**Ticket to Ride - Brasil** é uma implementação digital do popular jogo de tabuleiro de coleta de conjuntos e conexão de rotas. Os jogadores coletam cartas coloridas para reivindicar rotas ferroviárias conectando cidades no mapa do Brasil, completando objetivos secretos para marcar o maior número de pontos.

### Características Principais

✅ **Multiplayer em Tempo Real** (2-5 jogadores)  
✅ **Interface Intuitiva e Responsiva**  
✅ **Mapa do Brasil** com 18 cidades e 25 rotas  
✅ **Sistema de Turnos Automatizado**  
✅ **Pontuação em Tempo Real**  
✅ **Bilhetes de Destino Secretos**  
✅ **Bônus de Caminho Mais Longo**  
✅ **Persistência de Dados** com PostgreSQL

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **Socket.IO Client** - Comunicação em tempo real
- **React Router** - Roteamento

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.IO** - WebSocket para multiplayer
- **PostgreSQL** - Banco de dados
- **pg** - Driver PostgreSQL

### Arquitetura
- **Clean Architecture** - Separação de camadas
- **MVC Pattern** - Models, Controllers, Services
- **WebSocket** - Comunicação bidirecional em tempo real
- **RESTful API** - Endpoints HTTP

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- Um navegador moderno (Chrome, Firefox, Safari)

## 🔧 Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd "Sonnet - Ticket to Ride - Projeto de Software"
```

### 2. Instale as Dependências do Backend

```bash
cd backend
npm install
```

### 3. Instale as Dependências do Frontend

```bash
cd ../frontend
npm install
```

### 4. Configure o Banco de Dados

#### Criar o Banco de Dados PostgreSQL

```bash
# Entre no PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE tickettoride;

# Saia do psql
\q
```

#### Execute o Script de Inicialização

```bash
# Execute o script SQL
psql -U postgres -d tickettoride -f ../database/init.sql
```

### 5. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```bash
cd backend
copy .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3001
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tickettoride
```

## ▶️ Como Executar

### Modo Desenvolvimento

Você precisará de **3 terminais** abertos:

#### Terminal 1 - Backend

```powershell
cd backend
npm run dev
```

O servidor backend estará rodando em `http://localhost:3001`

#### Terminal 2 - Frontend

```powershell
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

#### Terminal 3 - Banco de Dados (se necessário)

Certifique-se de que o PostgreSQL está rodando. No Windows, você pode verificar nos serviços:

```powershell
# Verificar status do PostgreSQL
Get-Service postgresql*

# Iniciar o serviço se necessário
Start-Service postgresql-x64-<version>
```

### Modo Produção

#### Build do Frontend

```bash
cd frontend
npm run build
```

#### Executar Backend em Produção

```bash
cd backend
npm start
```

## 🎯 Como Jogar

### **Início Rápido**

1. **Acesse:** `http://localhost:3000`
2. **Crie um jogo** ou **entre com um código**
3. **Aguarde outros jogadores** (2-5 jogadores)
4. **O host inicia o jogo**
5. **Jogue seu turno!**

### **Objetivo do Jogo**

Ser o jogador com **mais pontos** ao final do jogo:
- 🛤️ Reivindique rotas entre cidades (pontos imediatos)
- 🎫 Complete bilhetes de destino (pontos finais)
- 🏆 Construa o caminho mais longo (+10 pontos bônus)

### **Durante Seu Turno - Escolha UMA ação:**

#### **1. 🎴 Comprar Cartas de Trem**
- Pegue **2 cartas** do baralho, OU
- Pegue **1 ou 2 cartas abertas** (viradas na mesa)
- ⚠️ **Locomotivas abertas** contam como 2 cartas!

#### **2. 🛤️ Reivindicar uma Rota**
- Selecione as cartas necessárias na sua mão
- Clique na rota no mapa
- Use Locomotivas 🚂 como coringas

**Exemplo:**
```
Rota: São Paulo → Curitiba (🟣🟣🟣 - 3 roxas)
Você pode usar:
✅ 3 cartas roxas
✅ 2 roxas + 1 Locomotiva
✅ 3 Locomotivas
```

#### **3. 🎫 Comprar Bilhetes de Destino**
- Pegue 3 novos bilhetes
- Deve manter pelo menos 1
- Pode devolver até 2

### **Sistema de Pontuação**

| Tamanho da Rota | Pontos |
|-----------------|--------|
| 1 peça | 1 pt |
| 2 peças | 2 pts |
| 3 peças | 4 pts |
| 4 peças | 7 pts |
| 5 peças | 10 pts |
| 6 peças | 15 pts |

**+ Bilhetes completos** ✅ (ganhe pontos)  
**- Bilhetes incompletos** ❌ (perca pontos)  
**+ Caminho mais longo** 🏆 (+10 pts)

### **Fim do Jogo**

O jogo termina quando um jogador fica com **≤ 2 peças de trem**.  
Todos jogam mais **1 turno final**.

---

📖 **[LEIA AS REGRAS COMPLETAS](REGRAS_DO_JOGO.md)** para estratégias, dicas e mecânicas detalhadas!

### Objetivo

Ser o jogador com mais pontos ao final do jogo, completando bilhetes de destino e reivindicando rotas.

### Mecânicas do Jogo

#### 1. Começando

1. **Criar ou Entrar em um Jogo**
   - Um jogador cria uma sala e recebe um código de 6 dígitos
   - Outros jogadores podem entrar usando este código
   - 2-5 jogadores são necessários para começar

2. **Distribuição Inicial**
   - 4 cartas de trem para cada jogador
   - 3 bilhetes de destino (deve manter pelo menos 2)
   - 45 peças de trem

#### 2. Durante Seu Turno

Escolha UMA das seguintes ações:

**A) Comprar Cartas de Trem**
- Pegue 2 cartas do baralho, OU
- Pegue 1 carta virada para cima + 1 do baralho
- ⚠️ Se pegar uma Locomotiva virada, só pode pegar 1 carta

**B) Reivindicar uma Rota**
- Selecione cartas da mesma cor igual ao tamanho da rota
- Clique na rota desejada no mapa
- Locomotivas (🚂) servem como coringa

**C) Comprar Bilhetes de Destino**
- Pegue 3 novos bilhetes
- Deve manter pelo menos 1

#### 3. Pontuação

**Pontos por Rota Reivindicada:**
- 1 peça = 1 ponto
- 2 peças = 2 pontos
- 3 peças = 4 pontos
- 4 peças = 7 pontos
- 5 peças = 10 pontos
- 6 peças = 15 pontos
- 7 peças = 18 pontos
- 8 peças = 21 pontos

**Pontos Finais:**
- ✅ Bilhetes completados: **+pontos do bilhete**
- ❌ Bilhetes incompletos: **-pontos do bilhete**
- 🏆 Caminho mais longo: **+10 pontos**

#### 4. Fim do Jogo

- O jogo entra na rodada final quando um jogador tem **≤ 2 peças de trem**
- Todos jogam mais uma rodada
- Contabilização final e declaração do vencedor

### Dicas Estratégicas

💡 **Planeje suas rotas** - Analise seus bilhetes antes de reivindicar rotas  
💡 **Guarde Locomotivas** - São valiosas e versáteis  
💡 **Observe os oponentes** - Veja quais rotas eles estão construindo  
💡 **Rotas longas = mais pontos** - Mas também mais arriscadas  
💡 **Complete bilhetes** - Pontos negativos doem no final!

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  (React + Vite + Socket.IO Client)              │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  Components  │  │   Services   │            │
│  │  (UI Layer)  │  │  (Socket)    │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
                      ▲  ▼
                  WebSocket / HTTP
                      ▲  ▼
┌─────────────────────────────────────────────────┐
│                   BACKEND                        │
│  (Node.js + Express + Socket.IO)                │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Controllers  │  │    Models    │            │
│  │  (Logic)     │  │  (Game, etc) │            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   Services   │  │     Data     │            │
│  │  (Database)  │  │  (Map data)  │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
                      ▲  ▼
                       SQL
                      ▲  ▼
┌─────────────────────────────────────────────────┐
│               POSTGRESQL DATABASE                │
│  (Jogadores, Partidas, Estatísticas)           │
└─────────────────────────────────────────────────┘
```

### Fluxo de Comunicação

1. **Cliente** faz ação (ex: comprar carta)
2. **Socket.IO** envia evento ao servidor
3. **GameController** processa a ação
4. **Game Model** atualiza o estado
5. **Servidor** emite evento para todos os clientes
6. **Clientes** atualizam suas UIs

## 📁 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── GameController.js      # Lógica de eventos WebSocket
│   │   ├── models/
│   │   │   ├── Game.js                # Modelo do jogo
│   │   │   ├── Player.js              # Modelo do jogador
│   │   │   ├── Deck.js                # Baralho de cartas
│   │   │   └── DestinationTicketDeck.js
│   │   ├── services/
│   │   │   └── DatabaseService.js     # Serviço de BD
│   │   ├── data/
│   │   │   └── brasilMap.js           # Dados do mapa
│   │   └── server.js                  # Servidor Express
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Menu.jsx               # Menu principal
│   │   │   ├── Lobby.jsx              # Sala de espera
│   │   │   ├── Game.jsx               # Jogo principal
│   │   │   ├── GameBoard.jsx          # Tabuleiro/Mapa
│   │   │   ├── PlayerHand.jsx         # Mão do jogador
│   │   │   ├── PlayersPanel.jsx       # Painel de jogadores
│   │   │   └── DeckArea.jsx           # Área dos baralhos
│   │   ├── services/
│   │   │   └── socket.js              # Cliente Socket.IO
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   └── init.sql                        # Script de inicialização
│
├── instructions.md                     # Especificações do projeto
└── README.md                           # Este arquivo
```

## 👥 Autores

- **Anna Beatriz Chaboudet**
- **João Portela Madureira**
- **Rafael Vilares**
- **João Pedro Valadares**
- **Matheus Marcus**
- **Ricardo Miranda Tanaka**

---

## 📝 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Suporte

Se você tiver alguma dúvida ou problema, por favor abra uma issue no repositório.

---

**Desenvolvido com ❤️ para a disciplina de Projeto de Software**

**Data:** Setembro de 2025  
**Versão:** 1.0.0
