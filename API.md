# 📡 API Documentation

## REST API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### GET `/api/health`
Verifica se o servidor está rodando.

**Response:**
```json
{
  "status": "OK",
  "message": "Servidor Ticket to Ride - Brasil está rodando!"
}
```

#### GET `/api/games`
Lista todos os jogos ativos.

**Response:**
```json
{
  "games": [
    {
      "id": "ABC123",
      "playerCount": 3,
      "maxPlayers": 5,
      "state": "waiting"
    }
  ]
}
```

---

## WebSocket Events

### Base URL
```
ws://localhost:3001
```

### Client → Server Events

#### `createGame`
Cria uma nova sala de jogo.

**Payload:**
```javascript
{
  playerName: "João"
}
```

**Response Event:** `gameCreated`

---

#### `joinGame`
Entra em uma sala existente.

**Payload:**
```javascript
{
  gameId: "ABC123",
  playerName: "Maria"
}
```

**Response Event:** `playerJoined`

---

#### `startGame`
Inicia o jogo (apenas host).

**Payload:**
```javascript
{
  gameId: "ABC123"
}
```

**Response Event:** `gameStarted`

---

#### `drawTrainCard`
Compra uma carta de trem.

**Payload:**
```javascript
{
  fromDeck: true,      // true = baralho, false = carta virada
  faceUpIndex: 0       // índice da carta virada (0-4), null se fromDeck=true
}
```

**Response Event:** `cardDrawn`

---

#### `claimRoute`
Reivindica uma rota no mapa.

**Payload:**
```javascript
{
  routeId: "r15",
  cardsUsed: ["blue", "blue", "blue", "locomotive"]
}
```

**Response Event:** `routeClaimed`

---

#### `drawDestinationTickets`
Compra bilhetes de destino.

**Payload:**
```javascript
{}
```

**Response Event:** `destinationTicketsDrawn`

---

#### `returnDestinationTickets`
Devolve bilhetes não desejados.

**Payload:**
```javascript
{
  ticketsToReturn: [
    { id: "t1", from: "manaus", to: "porto-alegre", points: 20 }
  ],
  ticketsToKeep: [
    { id: "t2", from: "sao-paulo", to: "curitiba", points: 6 },
    { id: "t3", from: "rio-de-janeiro", to: "belo-horizonte", points: 7 }
  ]
}
```

**Response Event:** `destinationTicketsKept`

---

### Server → Client Events

#### `gameCreated`
Confirmação de criação do jogo.

**Payload:**
```javascript
{
  gameId: "ABC123",
  game: {
    id: "ABC123",
    players: [...],
    gameState: "waiting",
    ...
  }
}
```

---

#### `playerJoined`
Novo jogador entrou na sala.

**Payload:**
```javascript
{
  player: {
    id: "socket-id",
    name: "Maria",
    color: "blue"
  },
  game: { ... }
}
```

---

#### `gameStarted`
O jogo começou.

**Payload:**
```javascript
{
  game: {
    id: "ABC123",
    gameState: "playing",
    currentPlayerIndex: 0,
    players: [...],
    ...
  }
}
```

---

#### `initialCards`
Cartas iniciais do jogador (enviado apenas para o jogador específico).

**Payload:**
```javascript
{
  trainCards: ["red", "blue", "green", "locomotive"],
  destinationTickets: [
    { id: "t1", from: "manaus", to: "porto-alegre", points: 20 },
    { id: "t2", from: "sao-paulo", to: "curitiba", points: 6 },
    { id: "t3", from: "rio-de-janeiro", to: "belo-horizonte", points: 7 }
  ]
}
```

---

#### `gameUpdated`
Estado do jogo foi atualizado (broadcast para todos).

**Payload:**
```javascript
{
  game: { ... },
  message: "João reivindicou uma rota!"  // opcional
}
```

---

#### `cardDrawn`
Carta comprada com sucesso (enviado apenas para o jogador).

**Payload:**
```javascript
{
  card: "blue",
  trainCards: ["red", "blue", "blue", "green", "locomotive"]
}
```

---

#### `routeClaimed`
Rota reivindicada com sucesso (enviado apenas para o jogador).

**Payload:**
```javascript
{
  routeId: "r15",
  trainCards: ["red", "green", "locomotive"],
  score: 15
}
```

---

#### `destinationTicketsDrawn`
Bilhetes de destino para escolher (enviado apenas para o jogador).

**Payload:**
```javascript
{
  tickets: [
    { id: "t10", from: "recife", to: "belo-horizonte", points: 10 },
    { id: "t11", from: "porto-velho", to: "campo-grande", points: 11 },
    { id: "t12", from: "fortaleza", to: "belo-horizonte", points: 12 }
  ]
}
```

---

#### `destinationTicketsKept`
Confirmação dos bilhetes mantidos (enviado apenas para o jogador).

**Payload:**
```javascript
{
  destinationTickets: [
    { id: "t1", from: "manaus", to: "porto-alegre", points: 20 },
    { id: "t10", from: "recife", to: "belo-horizonte", points: 10 }
  ]
}
```

---

#### `gameEnded`
O jogo terminou (broadcast para todos).

**Payload:**
```javascript
{
  game: { ... },
  winner: {
    id: "socket-id",
    name: "João",
    score: 85
  }
}
```

---

#### `playerDisconnected`
Um jogador se desconectou (broadcast para todos).

**Payload:**
```javascript
{
  playerId: "socket-id",
  playerName: "Maria"
}
```

---

#### `error`
Erro ao processar uma ação.

**Payload:**
```javascript
{
  message: "Não é o turno deste jogador"
}
```

---

## Data Models

### Game
```typescript
{
  id: string,
  players: Player[],
  currentPlayerIndex: number,
  currentPlayer: Player,
  trainCardDeck: {
    cardsRemaining: number,
    faceUpCards: string[],
    discardPileSize: number
  },
  destinationTicketDeck: {
    ticketsRemaining: number
  },
  routes: Route[],
  gameState: "waiting" | "playing" | "finished",
  lastRound: boolean,
  winner: Player | null
}
```

### Player
```typescript
{
  id: string,
  name: string,
  color: string,
  trainCardsCount: number,
  destinationTicketsCount: number,
  claimedRoutes: Route[],
  trainPieces: number,
  score: number
}
```

### Route
```typescript
{
  id: string,
  city1: string,
  city2: string,
  color: string,
  length: number,
  claimedBy: string | null
}
```

### Destination Ticket
```typescript
{
  id: string,
  from: string,
  to: string,
  points: number
}
```

---

## Example Usage

### JavaScript/React

```javascript
import { io } from 'socket.io-client';

// Conectar ao servidor
const socket = io('http://localhost:3001');

// Criar um jogo
socket.emit('createGame', { playerName: 'João' });

// Escutar resposta
socket.on('gameCreated', (data) => {
  console.log('Jogo criado:', data.gameId);
});

// Comprar uma carta
socket.emit('drawTrainCard', { fromDeck: true });

// Reivindicar rota
socket.emit('claimRoute', {
  routeId: 'r15',
  cardsUsed: ['blue', 'blue', 'blue', 'blue']
});
```

---

## Error Codes

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| `GAME_NOT_FOUND` | "Jogo não encontrado" | O gameId fornecido não existe |
| `GAME_FULL` | "Jogo está cheio" | Máximo de 5 jogadores atingido |
| `GAME_STARTED` | "Jogo já começou" | Não pode mais entrar |
| `NOT_YOUR_TURN` | "Não é o turno deste jogador" | Aguarde sua vez |
| `INVALID_ACTION` | "Ação inválida" | Ação não permitida no contexto atual |
| `INSUFFICIENT_CARDS` | "Cartas insuficientes" | Não tem cartas suficientes |
| `ROUTE_CLAIMED` | "Rota já foi reivindicada" | Outro jogador já pegou essa rota |

---

## Rate Limiting

Atualmente não há rate limiting implementado, mas recomenda-se:
- Máximo 10 ações por segundo por jogador
- Timeout de 30 segundos para escolher bilhetes de destino

---

## WebSocket Connection States

```javascript
socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
  // Reasons: "io server disconnect", "io client disconnect", 
  // "ping timeout", "transport close", "transport error"
});

socket.on('connect_error', (error) => {
  console.error('Erro de conexão:', error);
});
```

---

## Testing the API

### Using curl (REST)

```bash
# Health check
curl http://localhost:3001/api/health

# Get games
curl http://localhost:3001/api/games
```

### Using Socket.IO Client Tool

Você pode usar ferramentas como:
- [Socket.IO Client Tool](https://amritb.github.io/socketio-client-tool/)
- [Postman](https://www.postman.com/) (suporta WebSocket)
- Ou o próprio DevTools do navegador

---

**Versão da API:** 1.0.0  
**Última Atualização:** Setembro 2025
