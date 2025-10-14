import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.socket.connected) {
      console.log('Socket já conectado:', this.socket.id);
      return this.socket;
    }

    if (this.socket) {
      console.log('Limpando socket anterior...');
      this.socket.removeAllListeners();
      this.socket.close();
    }

    console.log('Criando nova conexão socket...');
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado ao servidor:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('⚠️ Desconectado do servidor. Razão:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Erro do servidor:', error);
      alert(error.message || 'Ocorreu um erro');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Gerenciamento de eventos
  on(event, callback) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket.on(event, callback);
    
    // Armazenar listener para remoção posterior
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    
    this.socket.off(event, callback);
    
    // Remover do mapa de listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket.emit(event, data);
  }

  // Métodos específicos do jogo
  createGame(playerName) {
    this.emit('createGame', { playerName });
  }

  joinGame(gameId, playerName) {
    this.emit('joinGame', { gameId, playerName });
  }

  startGame(gameId) {
    this.emit('startGame', { gameId });
  }

  drawTrainCard(fromDeck = true, faceUpIndex = null) {
    this.emit('drawTrainCard', { fromDeck, faceUpIndex });
  }

  claimRoute(routeId, cardsUsed) {
    this.emit('claimRoute', { routeId, cardsUsed });
  }

  drawDestinationTickets() {
    this.emit('drawDestinationTickets', {});
  }

  returnDestinationTickets(ticketsToReturn, ticketsToKeep) {
    this.emit('returnDestinationTickets', { ticketsToReturn, ticketsToKeep });
  }
}

export default new SocketService();
