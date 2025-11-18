# Padrões de Projeto - Ticket to Ride Brasil

Este documento identifica e explica os padrões GRASP e GoF utilizados no projeto Ticket to Ride Brasil.

---

## 📋 Sumário

1. [Padrões GRASP](#padrões-grasp)
   - [Controller (Controlador)](#1-controller-controlador)
   - [Information Expert (Especialista na Informação)](#2-information-expert-especialista-na-informação)
   - [Creator (Criador)](#3-creator-criador)
   - [Low Coupling (Baixo Acoplamento)](#4-low-coupling-baixo-acoplamento)
   - [High Cohesion (Alta Coesão)](#5-high-cohesion-alta-coesão)
   - [Polymorphism (Polimorfismo)](#6-polymorphism-polimorfismo)

2. [Padrões GoF](#padrões-gof)
   - [Singleton](#1-singleton)
   - [Strategy](#2-strategy)
   - [Template Method](#3-template-method)
   - [State](#4-state)
   - [Observer](#5-observer)

---

## Padrões GRASP

### 1. Controller (Controlador)

**Localização**: `backend/src/controllers/GameController.js`

#### Descrição
O padrão Controller atribui a responsabilidade de lidar com eventos do sistema a uma classe não-UI que representa o cenário geral do caso de uso.

#### Implementação

```javascript
export class GameController {
  constructor(io) {
    this.io = io;
    this.games = new Map();
    this.playerToGame = new Map();
    this.playerColors = ['red', 'blue', 'green', 'yellow', 'purple'];
  }

  createGame(socket, data) {
    const { playerName } = data;
    const gameId = this.generateGameId();
    const player = new Player(socket.id, playerName, this.playerColors[0]);
    const game = new Game(gameId, player);
    // ...
  }

  joinGame(socket, data) {
    // Gerencia a entrada de jogadores
  }

  startGame(socket, data) {
    // Gerencia o início do jogo
  }

  claimRoute(socket, data) {
    // Gerencia reivindicação de rotas
  }
}
```

#### Justificativa
- **Separação de responsabilidades**: O `GameController` atua como intermediário entre a interface de comunicação (WebSocket) e a lógica de negócio (modelos Game, Player)
- **Coordenação de operações**: Gerencia o fluxo de eventos do jogo (criar, entrar, iniciar, jogar)
- **Ponto central de controle**: Todas as operações do jogo passam pelo controller, facilitando manutenção e debugging
- **Delegação apropriada**: O controller não implementa a lógica do jogo, apenas coordena e delega para os objetos de domínio apropriados

#### Benefícios
- Facilita testes unitários isolando a lógica de negócio
- Reduz acoplamento entre camada de apresentação e domínio
- Centraliza o tratamento de erros e validações de entrada
- Melhora a rastreabilidade das operações do sistema

---

### 2. Information Expert (Especialista na Informação)

**Localização**: `backend/src/models/Player.js` e `backend/src/models/Game.js`

#### Descrição
O padrão Information Expert atribui uma responsabilidade ao objeto que tem a informação necessária para cumpri-la.

#### Implementação em Player.js

```javascript
export class Player {
  constructor(id, name, color) {
    this.trainCards = [];
    this.destinationTickets = [];
    this.claimedRoutes = [];
    this.score = 0;
  }

  // O Player é expert sobre suas próprias rotas
  hasPathBetween(city1, city2) {
    const visited = new Set();
    const queue = [city1];
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === city2) return true;
      if (visited.has(current)) continue;
      
      visited.add(current);
      
      // Navega pelas rotas reivindicadas pelo jogador
      this.claimedRoutes.forEach(route => {
        if (route.city1 === current && !visited.has(route.city2)) {
          queue.push(route.city2);
        } else if (route.city2 === current && !visited.has(route.city1)) {
          queue.push(route.city1);
        }
      });
    }
    return false;
  }

  // O Player é expert sobre a completude de seus bilhetes
  isDestinationComplete(ticket) {
    return this.hasPathBetween(ticket.from, ticket.to);
  }

  // O Player é expert sobre seu próprio score
  calculateFinalScore() {
    this.destinationTickets.forEach(ticket => {
      if (this.isDestinationComplete(ticket)) {
        this.score += ticket.points;
      } else {
        this.score -= ticket.points;
      }
    });
  }

  // O Player é expert sobre seus recursos
  getPointsForRoute(length) {
    const pointsMap = {
      1: 1, 2: 2, 3: 4, 4: 7, 
      5: 10, 6: 15, 7: 18, 8: 21
    };
    return pointsMap[length] || 0;
  }
}
```

#### Implementação em Game.js

```javascript
export class Game {
  constructor(gameId, hostPlayer) {
    this.players = [hostPlayer];
    this.currentPlayerIndex = 0;
    this.trainCardDeck = new Deck();
    this.routes = routes.map(route => ({...route, claimedBy: null}));
    this.gameState = 'waiting';
  }

  // Game é expert sobre turnos
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.turnAction = null;
    this.cardDrawnCount = 0;
    
    if (this.lastRound && this.currentPlayerIndex === this.players.indexOf(this.finalTurnPlayer)) {
      this.endGame();
    }
  }

  // Game é expert sobre validação de cartas
  validateCards(cardsUsed, route) {
    if (cardsUsed.length !== route.length) return false;
    
    const locomotives = cardsUsed.filter(card => card === 'locomotive').length;
    const colorCards = cardsUsed.filter(card => card === route.color).length;
    
    if (route.color === 'gray') {
      const uniqueColors = new Set(cardsUsed.filter(c => c !== 'locomotive'));
      return uniqueColors.size <= 1;
    }
    
    return (colorCards + locomotives) === route.length;
  }
}
```

#### Justificativa
- **Coesão**: Cada classe mantém e manipula apenas suas próprias informações
- **Encapsulamento**: Os dados e operações sobre eles estão no mesmo lugar
- **Manutenibilidade**: Mudanças na lógica de cálculo de pontos só afetam a classe Player
- **Responsabilidade clara**: Cada objeto sabe como processar suas próprias informações

#### Benefícios
- Reduz dependências entre classes
- Facilita a compreensão do código
- Melhora a testabilidade de componentes individuais
- Previne lógica duplicada

---

### 3. Creator (Criador)

**Localização**: `backend/src/models/Game.js`

#### Descrição
O padrão Creator atribui a responsabilidade de criar uma instância da classe A para a classe B se uma ou mais das seguintes condições forem verdadeiras: B contém A, B agrega A, B usa A, B tem os dados para inicializar A.

#### Implementação

```javascript
export class Game {
  constructor(gameId, hostPlayer) {
    this.id = gameId;
    this.players = [hostPlayer];
    
    // Game cria os decks porque:
    // 1. Game contém/agrega os decks
    // 2. Game tem os dados para inicializá-los
    // 3. Game é responsável pelo ciclo de vida dos decks
    this.trainCardDeck = new Deck();
    this.destinationTicketDeck = new DestinationTicketDeck(destinationTickets);
    
    // Game cria a estrutura de rotas porque gerencia o tabuleiro
    this.routes = routes.map(route => ({
      ...route,
      claimedBy: null
    }));
    
    this.gameState = 'waiting';
    this.lastRound = false;
  }

  startGame() {
    // Game cria o estado inicial do jogo
    this.players.forEach(player => {
      // Distribui cartas de trem
      for (let i = 0; i < 4; i++) {
        player.addTrainCard(this.trainCardDeck.drawCard());
      }
      
      // Distribui bilhetes de destino
      const tickets = this.destinationTicketDeck.drawTickets(3);
      tickets.forEach(ticket => player.addDestinationTicket(ticket));
    });
    
    this.shufflePlayers();
    this.gameState = 'playing';
  }
}
```

#### Implementação em GameController.js

```javascript
export class GameController {
  createGame(socket, data) {
    const { playerName } = data;
    const gameId = this.generateGameId();
    
    // GameController cria Player porque tem os dados necessários
    const player = new Player(socket.id, playerName, this.playerColors[0]);
    
    // GameController cria Game porque:
    // 1. Gerencia a coleção de games
    // 2. Tem os dados de inicialização (gameId, player)
    const game = new Game(gameId, player);
    
    this.games.set(gameId, game);
    this.playerToGame.set(socket.id, gameId);
    
    socket.join(gameId);
  }

  joinGame(socket, data) {
    const { gameId, playerName } = data;
    const game = this.games.get(gameId);
    
    // Controller cria novos Players quando entram no jogo
    const colorIndex = game.players.length;
    const player = new Player(socket.id, playerName, this.playerColors[colorIndex]);
    
    game.addPlayer(player);
  }
}
```

#### Justificativa
- **Agregação natural**: Game agrega Deck e DestinationTicketDeck, logo deve criá-los
- **Conhecimento de inicialização**: Game tem os dados necessários (destinationTickets, routes)
- **Ciclo de vida**: Game controla quando os decks devem existir e ser inicializados
- **Baixo acoplamento**: Evita que classes externas precisem conhecer detalhes de construção

#### Benefícios
- Centraliza a lógica de criação
- Reduz dependências entre objetos
- Facilita mudanças nos construtores
- Torna o código mais intuitivo e previsível

---

### 4. Low Coupling (Baixo Acoplamento)

**Localização**: Arquitetura geral do projeto

#### Descrição
O padrão Low Coupling busca minimizar as dependências entre classes, tornando o sistema mais modular e fácil de modificar.

#### Implementação

**Estrutura modular:**
```
backend/src/
├── server.js              # Ponto de entrada, configuração
├── controllers/
│   └── GameController.js  # Coordenação (não conhece detalhes de modelos)
├── models/
│   ├── Game.js           # Lógica de jogo (independente de controller)
│   ├── Player.js         # Lógica de jogador (independente)
│   ├── Deck.js           # Lógica de baralho (independente)
│   └── DestinationTicketDeck.js
├── services/
│   └── DatabaseService.js # Persistência (isolada do domínio)
└── data/
    └── brasilMap.js      # Dados estáticos (independentes)
```

**Exemplo de baixo acoplamento:**

```javascript
// server.js - Apenas coordena, não conhece detalhes
const gameController = new GameController(io);

io.on('connection', (socket) => {
  socket.on('createGame', (data) => {
    gameController.createGame(socket, data);
  });
});
```

```javascript
// GameController.js - Usa interfaces simples dos modelos
export class GameController {
  createGame(socket, data) {
    // Não conhece implementação interna de Game ou Player
    const player = new Player(socket.id, playerName, color);
    const game = new Game(gameId, player);
    // Apenas coordena
  }
}
```

```javascript
// Game.js - Independente de controller e persistência
export class Game {
  // Não conhece GameController
  // Não conhece Socket.IO
  // Não conhece DatabaseService
  // Apenas lógica de negócio pura
  
  claimRoute(playerId, routeId, cardsUsed) {
    const player = this.getPlayerById(playerId);
    const route = this.routes.find(r => r.id === routeId);
    // Lógica pura sem dependências externas
  }
}
```

#### Justificativa
- **Módulos independentes**: Cada classe tem responsabilidades bem definidas
- **Inversão de dependências**: Controller depende de abstrações, não de implementações
- **Separação de camadas**: Apresentação, Controle, Domínio e Dados são separados
- **Interfaces simples**: Comunicação entre módulos via métodos públicos mínimos

#### Benefícios
- Facilita testes unitários (pode testar Game sem Controller)
- Permite mudanças isoladas (mudar Deck não afeta Game)
- Reutilização de código (Player pode ser usado em outros contextos)
- Manutenção simplificada (erros localizados em módulos específicos)

---

### 5. High Cohesion (Alta Coesão)

**Localização**: Todas as classes de modelo

#### Descrição
O padrão High Cohesion busca manter as responsabilidades de uma classe focadas, relacionadas e gerenciáveis, evitando que uma classe faça coisas demais ou não relacionadas.

#### Implementação

**Deck.js - Alta coesão em operações de baralho:**
```javascript
export class Deck {
  constructor() {
    this.cards = [];
    this.discardPile = [];
    this.faceUpCards = [];
    this.initializeDeck();
  }

  // TODAS as responsabilidades relacionadas ao baralho de cartas
  initializeDeck() { /* Inicialização */ }
  shuffle() { /* Embaralhamento */ }
  drawCard() { /* Compra do deck */ }
  drawFaceUpCard(index) { /* Compra face-up */ }
  checkForThreeLocomotives() { /* Validação específica */ }
  reshuffleDiscardPile() { /* Reembaralhamento */ }
  discardCards(cards) { /* Descarte */ }
  getCardsRemaining() { /* Consulta */ }
  toJSON() { /* Serialização */ }
}
```

**Player.js - Alta coesão em operações de jogador:**
```javascript
export class Player {
  // TODAS as responsabilidades relacionadas ao jogador
  
  // Gerenciamento de cartas
  addTrainCard(card) { /* */ }
  removeTrainCards(color, count) { /* */ }
  
  // Gerenciamento de bilhetes
  addDestinationTicket(ticket) { /* */ }
  isDestinationComplete(ticket) { /* */ }
  
  // Gerenciamento de rotas
  claimRoute(route) { /* */ }
  hasPathBetween(city1, city2) { /* */ }
  
  // Cálculo de pontuação
  getPointsForRoute(length) { /* */ }
  calculateFinalScore() { /* */ }
}
```

**Contraste com Baixa Coesão (anti-pattern):**
```javascript
// ❌ Exemplo de BAIXA coesão (o que NÃO fazemos)
class GameManager {
  // Mistura responsabilidades não relacionadas
  connectToDatabase() { /* */ }
  shuffleCards() { /* */ }
  sendEmail() { /* */ }
  calculateScore() { /* */ }
  renderUI() { /* */ }
  validatePassword() { /* */ }
}
```

#### Justificativa
- **Foco claro**: Cada classe tem um propósito único e bem definido
- **Facilidade de compreensão**: Todas as operações de uma classe são relacionadas
- **Manutenibilidade**: Mudanças em um conceito afetam apenas uma classe
- **Reusabilidade**: Classes coesas são mais fáceis de reutilizar em outros contextos

#### Benefícios
- Código mais fácil de entender e documentar
- Menos efeitos colaterais ao fazer mudanças
- Testes mais simples e focados
- Melhor organização do código

---

### 6. Polymorphism (Polimorfismo)

**Localização**: Classes Deck e DestinationTicketDeck

#### Descrição
O padrão Polymorphism atribui responsabilidades a abstrações, permitindo que diferentes tipos de objetos sejam tratados através de uma interface comum, com comportamentos variáveis baseados no tipo concreto.

#### Implementação

**Interface comum entre Deck e DestinationTicketDeck:**

```javascript
// Deck.js - Implementação para cartas de trem
export class Deck {
  constructor() {
    this.cards = [];
    this.initializeDeck();
  }

  // Método polimórfico: shuffle
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Método polimórfico: draw (nome diferente mas conceito similar)
  drawCard() {
    if (this.cards.length === 0) {
      this.reshuffleDiscardPile();
    }
    return this.cards.pop();
  }

  // Método polimórfico: toJSON
  toJSON() {
    return {
      cardsRemaining: this.cards.length,
      faceUpCards: this.faceUpCards,
      discardPileSize: this.discardPile.length
    };
  }
}

// DestinationTicketDeck.js - Implementação para bilhetes
export class DestinationTicketDeck {
  constructor(tickets) {
    this.tickets = [...tickets];
    this.shuffle();
  }

  // MESMA interface de shuffle, comportamento SIMILAR
  shuffle() {
    for (let i = this.tickets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tickets[i], this.tickets[j]] = [this.tickets[j], this.tickets[i]];
    }
  }

  // Operação similar a drawCard, mas com nome específico
  drawTickets(count) {
    const drawn = [];
    for (let i = 0; i < count && this.tickets.length > 0; i++) {
      drawn.push(this.tickets.pop());
    }
    return drawn;
  }

  // MESMA interface toJSON, estrutura DIFERENTE
  toJSON() {
    return {
      ticketsRemaining: this.tickets.length
    };
  }
}
```

**Uso polimórfico em Game.js:**
```javascript
export class Game {
  constructor(gameId, hostPlayer) {
    // Ambos os decks implementam operações similares
    this.trainCardDeck = new Deck();
    this.destinationTicketDeck = new DestinationTicketDeck(destinationTickets);
  }

  // Usa polimorficamente ambos os decks
  toJSON() {
    return {
      // Ambos respondem a toJSON()
      trainCardDeck: this.trainCardDeck.toJSON(),
      destinationTicketDeck: this.destinationTicketDeck.toJSON(),
      // ...
    };
  }
}
```

#### Justificativa
- **Interface comum**: Ambos os decks possuem operações similares (`shuffle`, `toJSON`)
- **Comportamentos específicos**: Cada deck implementa suas regras particulares
- **Tratamento uniforme**: Game pode trabalhar com ambos através de operações similares
- **Extensibilidade**: Novos tipos de deck podem ser adicionados seguindo a interface

#### Benefícios
- Reduz código condicional (if/else para tipos diferentes)
- Facilita adição de novos tipos de deck
- Torna o código mais genérico e reutilizável
- Melhora a testabilidade através de interfaces comuns

---

## Padrões GoF

### 1. Singleton

**Localização**: `backend/src/services/DatabaseService.js`

#### Descrição
O padrão Singleton garante que uma classe tenha apenas uma instância e fornece um ponto global de acesso a ela.

#### Implementação

```javascript
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexões é criado uma única vez (singleton implícito)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tickettoride',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export class DatabaseService {
  // Todos os métodos são estáticos, compartilham o mesmo pool
  static async createPlayer(username, email, passwordHash) {
    const query = `
      INSERT INTO players (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    const result = await pool.query(query, [username, email, passwordHash]);
    return result.rows[0];
  }

  static async getPlayerByUsername(username) {
    const query = 'SELECT * FROM players WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async testConnection() {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Banco de dados conectado com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco:', error.message);
      return false;
    }
  }
}
```

#### Características Singleton
1. **Instância única**: O objeto `pool` é criado uma única vez no módulo
2. **Acesso global**: Qualquer parte do código pode importar `DatabaseService`
3. **Métodos estáticos**: Não há necessidade de criar instâncias da classe
4. **Controle de recursos**: Pool de conexões gerenciado centralmente

#### Justificativa
- **Gerenciamento de recursos**: Conexões com banco de dados são recursos limitados e caros
- **Consistência**: Todas as operações usam o mesmo pool de conexões
- **Performance**: Reutiliza conexões existentes em vez de criar novas
- **Thread-safety**: Pool gerencia concorrência automaticamente

#### Benefícios
- Economiza recursos do sistema (memória e conexões)
- Evita problemas de múltiplas conexões simultâneas
- Centraliza configuração de banco de dados
- Facilita monitoramento e logging

#### Uso no código

```javascript
// Em qualquer parte do backend
import DatabaseService from './services/DatabaseService.js';

// Todos compartilham o mesmo pool
const player = await DatabaseService.createPlayer(username, email, hash);
const stats = await DatabaseService.getPlayerStats(playerId);
```

---

### 2. Strategy

**Localização**: `backend/src/models/Deck.js`

#### Descrição
O padrão Strategy define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis. Strategy permite que o algoritmo varie independentemente dos clientes que o utilizam.

#### Implementação

```javascript
export class Deck {
  constructor() {
    this.cards = [];
    this.discardPile = [];
    this.faceUpCards = [];
    this.initializeDeck();
  }

  // Strategy: Algoritmo de embaralhamento
  shuffle() {
    // Algoritmo Fisher-Yates (pode ser substituído por outros)
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Strategy: Algoritmo de compra (duas estratégias diferentes)
  drawCard() {
    // Estratégia 1: Comprar do deck fechado
    if (this.cards.length === 0) {
      this.reshuffleDiscardPile();
    }
    return this.cards.pop();
  }

  drawFaceUpCard(index) {
    // Estratégia 2: Comprar carta específica virada para cima
    if (index < 0 || index >= this.faceUpCards.length) {
      return null;
    }
    
    const card = this.faceUpCards.splice(index, 1)[0];
    
    // Repor a carta
    if (this.cards.length > 0) {
      this.faceUpCards.push(this.cards.pop());
    }
    
    // Estratégia de validação específica
    this.checkForThreeLocomotives();
    
    return card;
  }

  // Strategy: Validação condicional
  checkForThreeLocomotives() {
    const locomotiveCount = this.faceUpCards.filter(
      card => card === 'locomotive'
    ).length;
    
    if (locomotiveCount >= 3) {
      // Estratégia de reembaralhamento
      this.discardPile.push(...this.faceUpCards);
      this.faceUpCards = [];
      
      for (let i = 0; i < 5 && this.cards.length > 0; i++) {
        this.faceUpCards.push(this.cards.pop());
      }
      
      // Recursão da estratégia se necessário
      if (this.faceUpCards.filter(card => card === 'locomotive').length >= 3) {
        this.checkForThreeLocomotives();
      }
    }
  }
}
```

#### Implementação em Game.js

```javascript
export class Game {
  // Strategy: Validação de cartas varia baseado na cor da rota
  validateCards(cardsUsed, route) {
    if (cardsUsed.length !== route.length) {
      return false;
    }
    
    const locomotives = cardsUsed.filter(card => card === 'locomotive').length;
    const colorCards = cardsUsed.filter(card => card === route.color).length;
    
    // Estratégia 1: Rota cinza (qualquer cor única)
    if (route.color === 'gray') {
      const nonLocomotives = cardsUsed.filter(c => c !== 'locomotive');
      
      if (nonLocomotives.length === 0) {
        return true; // Todas locomotivas
      }
      
      const firstColor = nonLocomotives[0];
      return nonLocomotives.every(card => card === firstColor);
    }
    
    // Estratégia 2: Rota colorida (cor específica + locomotivas)
    return (colorCards + locomotives) === route.length;
  }

  // Strategy: Cálculo de pontuação varia no fim do jogo
  endGame() {
    // Estratégia 1: Calcular pontos dos bilhetes
    this.players.forEach(player => {
      player.calculateFinalScore();
    });
    
    // Estratégia 2: Calcular caminho mais longo
    this.calculateLongestPath();
    
    if (this.longestPathPlayer) {
      this.longestPathPlayer.score += 10;
    }
    
    this.gameState = 'finished';
  }
}
```

#### Justificativa
- **Múltiplos algoritmos**: Diferentes formas de comprar cartas (deck vs face-up)
- **Validação condicional**: Lógica varia baseado no tipo de rota (cinza vs colorida)
- **Intercambiabilidade**: Algoritmo de shuffle pode ser facilmente substituído
- **Encapsulamento**: Cada estratégia é um método independente

#### Benefícios
- Facilita adicionar novos tipos de validação (ex: rotas duplas)
- Permite testar cada estratégia isoladamente
- Torna o código mais legível (intenção clara de cada método)
- Simplifica manutenção (mudança em uma estratégia não afeta outras)

#### Possíveis Extensões

```javascript
// Exemplo de como adicionar novas estratégias

// Nova estratégia de embaralhamento
class AdvancedShuffle {
  shuffle(cards) {
    // Algoritmo de embaralhamento mais sofisticado
    return shuffledCards;
  }
}

// Nova estratégia de validação para expansões
class ExpansionValidator {
  validate(cardsUsed, route) {
    // Regras especiais para rotas de expansão
    return isValid;
  }
}
```

---

### 3. Template Method

**Localização**: `backend/src/models/Deck.js` e `backend/src/models/DestinationTicketDeck.js`

#### Descrição
O padrão Template Method define o esqueleto de um algoritmo em uma operação, postergando alguns passos para as subclasses/implementações. Permite que subclasses redefinam certos passos do algoritmo sem mudar sua estrutura.

#### Implementação

**Template comum de inicialização de baralhos:**

```javascript
// Deck.js - Template para baralho de cartas de trem
export class Deck {
  constructor() {
    // Template Method: sequência fixa de inicialização
    this.cards = [];
    this.discardPile = [];      // Passo específico
    this.faceUpCards = [];       // Passo específico
    this.initializeDeck();       // Método template
  }

  initializeDeck() {
    // Passo 1: Criar cartas (específico para este tipo)
    const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple'];
    colors.forEach(color => {
      for (let i = 0; i < 12; i++) {
        this.cards.push(color);
      }
    });
    
    for (let i = 0; i < 14; i++) {
      this.cards.push('locomotive');
    }
    
    // Passo 2: Embaralhar (comum)
    this.shuffle();
    
    // Passo 3: Setup inicial (específico para este tipo)
    for (let i = 0; i < 5; i++) {
      this.faceUpCards.push(this.cards.pop());
    }
  }
}

// DestinationTicketDeck.js - Mesma estrutura, implementação diferente
export class DestinationTicketDeck {
  constructor(tickets) {
    // Template Method: mesma sequência básica
    this.tickets = [...tickets]; // Passo 1: Inicializar dados (diferente)
    this.shuffle();              // Passo 2: Embaralhar (igual)
    // Não tem Passo 3 (face-up cards)
  }
}
```

**Template de compra de cartas/bilhetes:**

```javascript
// Ambas as classes seguem o template:
// 1. Verificar disponibilidade
// 2. Remover do deck
// 3. Retornar resultado

// Deck.js
drawCard() {
  if (this.cards.length === 0) {        // 1. Verificar
    this.reshuffleDiscardPile();
  }
  return this.cards.pop();               // 2. Remover e 3. Retornar
}

// DestinationTicketDeck.js
drawTickets(count) {
  const drawn = [];
  for (let i = 0; i < count && this.tickets.length > 0; i++) {  // 1. Verificar
    drawn.push(this.tickets.pop());                              // 2. Remover
  }
  return drawn;                                                  // 3. Retornar
}
```

#### Justificativa
- **Algoritmo consistente**: Ambos os decks seguem os mesmos passos básicos
- **Variações controladas**: Cada implementação customiza apenas os passos necessários
- **Manutenibilidade**: Mudanças na estrutura afetam todas as implementações
- **Clareza**: Estrutura comum facilita compreensão do código

#### Benefícios
- Evita duplicação de lógica comum
- Garante que todos os decks sigam o mesmo fluxo básico
- Facilita adição de novos tipos de deck
- Torna o comportamento previsível

---

### 4. State

**Localização**: `backend/src/models/Game.js`

#### Descrição
O padrão State permite que um objeto altere seu comportamento quando seu estado interno muda. O objeto parecerá ter mudado de classe.

#### Implementação

```javascript
export class Game {
  constructor(gameId, hostPlayer) {
    this.gameState = 'waiting'; // Estados: waiting, playing, finished
    this.turnAction = null;      // Estados de turno: null, drawCards, claimRoute
    this.lastRound = false;
  }

  // Comportamento muda baseado no estado 'gameState'
  addPlayer(player) {
    // Só funciona no estado 'waiting'
    if (this.gameState !== 'waiting') {
      throw new Error('Jogo já começou');
    }
    this.players.push(player);
  }

  startGame() {
    // Transição de estado: waiting -> playing
    if (this.gameState !== 'waiting') {
      throw new Error('Jogo já começou');
    }
    
    // Inicializa o jogo...
    this.gameState = 'playing'; // Mudança de estado
  }

  // Comportamento muda baseado no estado 'turnAction'
  drawTrainCard(playerId, fromDeck = true, faceUpIndex = null) {
    // Valida baseado no estado atual do turno
    if (this.turnAction && this.turnAction !== 'drawCards') {
      throw new Error('Ação diferente já foi realizada neste turno');
    }
    
    if (this.cardDrawnCount >= 2) {
      throw new Error('Já comprou 2 cartas neste turno');
    }
    
    // Executa ação...
    this.turnAction = 'drawCards'; // Atualiza estado do turno
    this.cardDrawnCount++;
    
    if (this.cardDrawnCount >= 2) {
      this.nextTurn(); // Transição para próximo turno
    }
  }

  claimRoute(playerId, routeId, cardsUsed) {
    // Comportamento bloqueado se já houve ação no turno
    if (this.turnAction) {
      throw new Error('Ação já foi realizada neste turno');
    }
    
    // Executa ação...
    this.turnAction = 'claimRoute'; // Atualiza estado
    
    // Verifica se entrou na última rodada (mudança de estado)
    if (player.trainPieces <= 2 && !this.lastRound) {
      this.lastRound = true;
      this.finalTurnPlayer = player;
    }
    
    this.nextTurn();
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    // Reset do estado do turno
    this.turnAction = null;
    this.cardDrawnCount = 0;
    
    // Transição para estado final
    if (this.lastRound && this.currentPlayerIndex === this.players.indexOf(this.finalTurnPlayer)) {
      this.endGame();
    }
  }

  endGame() {
    // Transição para estado final: playing -> finished
    this.gameState = 'finished';
    
    this.players.forEach(player => {
      player.calculateFinalScore();
    });
    
    this.calculateLongestPath();
  }
}
```

**Diagrama de Estados:**
```
gameState:
  waiting -> playing -> finished

turnAction (durante 'playing'):
  null -> drawCards -> null (após 2 cartas)
  null -> claimRoute -> null (após reivindicar)
  null -> drawDestinationTickets -> null (após escolher)

lastRound:
  false -> true (quando jogador tem <= 2 peças)
```

#### Justificativa
- **Comportamento condicional**: Ações permitidas variam conforme o estado
- **Transições controladas**: Estados mudam apenas através de métodos específicos
- **Validações baseadas em estado**: Cada método valida o estado antes de executar
- **Múltiplos estados simultâneos**: gameState, turnAction, lastRound trabalham juntos

#### Benefícios
- Previne operações inválidas (ex: adicionar jogador após início)
- Torna o fluxo do jogo mais previsível
- Facilita debugging (saber em que estado o jogo está)
- Simplifica lógica de validação

---

### 5. Observer

**Localização**: `backend/src/server.js` e `backend/src/controllers/GameController.js`

#### Descrição
O padrão Observer define uma dependência um-para-muitos entre objetos, de modo que quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente.

#### Implementação

**Socket.IO implementa Observer nativamente:**

```javascript
// server.js - Setup do padrão Observer
import { Server } from 'socket.io';

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const gameController = new GameController(io);

// Observadores (clients) se registram para eventos
io.on('connection', (socket) => {
  console.log(`Jogador conectado: ${socket.id}`);

  // Socket é um observador de eventos do cliente
  socket.on('createGame', (data) => {
    gameController.createGame(socket, data);
  });

  socket.on('claimRoute', (data) => {
    gameController.claimRoute(socket, data);
  });
  
  // ... outros eventos
});
```

**GameController notifica observadores:**

```javascript
export class GameController {
  constructor(io) {
    this.io = io; // Subject que notificará observers
    this.games = new Map();
  }

  // Notifica TODOS os observadores de uma sala
  joinGame(socket, data) {
    const game = this.games.get(gameId);
    const player = new Player(socket.id, playerName, color);
    
    game.addPlayer(player);
    socket.join(gameId); // Socket entra na sala (vira observer)
    
    // NOTIFICA todos os observers da sala
    this.io.to(gameId).emit('playerJoined', {
      player: player.toJSON(),
      game: game.toJSON()
    });
  }

  // Notifica observadores quando o jogo inicia
  startGame(socket, data) {
    const game = this.games.get(gameId);
    game.startGame();
    
    // NOTIFICA todos os observers
    this.io.to(gameId).emit('gameStarted', {
      game: game.toJSON()
    });
    
    // NOTIFICA cada observer individualmente com dados privados
    game.players.forEach(player => {
      const playerSocket = this.io.sockets.sockets.get(player.id);
      if (playerSocket) {
        playerSocket.emit('initialCards', {
          trainCards: player.trainCards,
          destinationTickets: player.destinationTickets
        });
      }
    });
  }

  // Notifica quando rota é reivindicada
  claimRoute(socket, data) {
    const game = this.games.get(gameId);
    game.claimRoute(socket.id, routeId, cardsUsed);
    
    // NOTIFICA todos os observers do estado atualizado
    this.io.to(gameId).emit('gameUpdated', {
      game: game.toJSON()
    });
    
    // NOTIFICA observer específico sobre suas cartas
    socket.emit('routeClaimed', {
      trainCards: player.trainCards
    });
  }

  // Notifica sobre desconexão
  handleDisconnect(socket) {
    const gameId = this.playerToGame.get(socket.id);
    const game = this.games.get(gameId);
    
    // NOTIFICA outros observers
    this.io.to(gameId).emit('playerDisconnected', {
      playerId: socket.id,
      playerName: player.name
    });
  }
}
```

**Estrutura do Observer:**
```
Subject (io / GameController)
    |
    |-- notifica --> Observer 1 (socket de jogador 1)
    |-- notifica --> Observer 2 (socket de jogador 2)
    |-- notifica --> Observer 3 (socket de jogador 3)
    |-- notifica --> Observer N (socket de jogador N)
```

**Tipos de notificações:**
- **Broadcast para sala**: `io.to(gameId).emit()` - todos os jogadores de um jogo
- **Unicast**: `socket.emit()` - apenas um jogador específico
- **Global**: `io.emit()` - todos os clientes conectados

#### Justificativa
- **Desacoplamento**: Game não precisa conhecer os clientes conectados
- **Sincronização**: Todos os jogadores veem o mesmo estado do jogo
- **Tempo real**: Mudanças são propagadas imediatamente
- **Escalabilidade**: Fácil adicionar novos observadores

#### Benefícios
- Interface em tempo real responsiva
- Estado consistente entre todos os clientes
- Fácil adicionar novos tipos de notificações
- Código desacoplado (Game não conhece Socket.IO)

---

## 🎯 Resumo dos Padrões Identificados

### Padrões GRASP (6)
1. **Controller** - GameController coordena operações do jogo
2. **Information Expert** - Player e Game gerenciam suas próprias informações
3. **Creator** - Game cria Decks, GameController cria Players e Games
4. **Low Coupling** - Arquitetura modular com separação clara de responsabilidades
5. **High Cohesion** - Cada classe tem responsabilidades focadas e relacionadas
6. **Polymorphism** - Deck e DestinationTicketDeck compartilham interface comum

### Padrões GoF (5)
1. **Singleton** - DatabaseService com pool único de conexões
2. **Strategy** - Múltiplas estratégias de validação e operação em Deck e Game
3. **Template Method** - Estrutura comum de inicialização entre diferentes decks
4. **State** - Game altera comportamento baseado em gameState e turnAction
5. **Observer** - Socket.IO notifica clientes sobre mudanças de estado do jogo

---

## 📚 Conclusão

O projeto Ticket to Ride Brasil demonstra uma aplicação sólida e diversificada de **11 padrões de projeto** (6 GRASP + 5 GoF), resultando em:

### ✅ Qualidades Alcançadas

- **Código manutenível**: Mudanças localizadas não afetam todo o sistema
- **Testabilidade**: Componentes podem ser testados isoladamente
- **Extensibilidade**: Novos recursos podem ser adicionados com mínimo impacto
- **Clareza**: Responsabilidades bem definidas facilitam compreensão
- **Performance**: Uso eficiente de recursos (Singleton para DB, Strategy para operações)
- **Tempo Real**: Sincronização automática entre clientes via Observer
- **Robustez**: Validações baseadas em estado previnem operações inválidas

### 🎓 Aprendizados

Estes padrões não foram aplicados de forma artificial, mas emergiram naturalmente das necessidades do domínio do problema:

- **GRASP** forneceu princípios fundamentais para atribuição de responsabilidades
- **GoF** ofereceu soluções reutilizáveis para problemas recorrentes de design
- A combinação de múltiplos padrões criou uma arquitetura coesa e profissional

O projeto demonstra que boas práticas de engenharia de software resultam em código mais limpo, organizado e fácil de evoluir.
