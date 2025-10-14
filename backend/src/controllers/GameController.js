import { Game } from '../models/Game.js';
import { Player } from '../models/Player.js';

export class GameController {
  constructor(io) {
    this.io = io;
    this.games = new Map(); // gameId -> Game
    this.playerToGame = new Map(); // socketId -> gameId
    this.playerColors = ['red', 'blue', 'green', 'yellow', 'purple'];
  }

  createGame(socket, data) {
    const { playerName } = data;
    const gameId = this.generateGameId();
    
    // Criar o primeiro jogador (host)
    const player = new Player(socket.id, playerName, this.playerColors[0]);
    
    // Criar o jogo
    const game = new Game(gameId, player);
    this.games.set(gameId, game);
    this.playerToGame.set(socket.id, gameId);
    
    // Jogador entra na sala
    socket.join(gameId);
    
    // Notificar o criador
    socket.emit('gameCreated', {
      gameId: gameId,
      game: game.toJSON()
    });
    
    console.log(`Jogo criado: ${gameId} por ${playerName}`);
  }

  joinGame(socket, data) {
    const { gameId, playerName } = data;
    
    const game = this.games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Jogo não encontrado' });
      return;
    }
    
    if (game.gameState !== 'waiting') {
      socket.emit('error', { message: 'Jogo já começou' });
      return;
    }
    
    if (game.players.length >= 5) {
      socket.emit('error', { message: 'Jogo está cheio' });
      return;
    }
    
    // Criar novo jogador
    const colorIndex = game.players.length;
    const player = new Player(socket.id, playerName, this.playerColors[colorIndex]);
    
    try {
      game.addPlayer(player);
      this.playerToGame.set(socket.id, gameId);
      
      // Jogador entra na sala
      socket.join(gameId);
      
      // Notificar todos os jogadores
      this.io.to(gameId).emit('playerJoined', {
        player: player.toJSON(),
        game: game.toJSON()
      });
      
      console.log(`${playerName} entrou no jogo ${gameId}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  startGame(socket, data) {
    const { gameId } = data;
    const game = this.games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Jogo não encontrado' });
      return;
    }
    
    // Verificar se o jogador é o host
    if (game.players[0].id !== socket.id) {
      socket.emit('error', { message: 'Apenas o host pode iniciar o jogo' });
      return;
    }
    
    try {
      game.startGame();
      
      // Notificar todos os jogadores
      this.io.to(gameId).emit('gameStarted', {
        game: game.toJSON()
      });
      
      // Enviar cartas e bilhetes iniciais para cada jogador
      game.players.forEach(player => {
        const playerSocket = this.io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('initialCards', {
            trainCards: player.trainCards,
            destinationTickets: player.destinationTickets
          });
        }
      });
      
      console.log(`Jogo ${gameId} iniciado`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  drawTrainCard(socket, data) {
    const { fromDeck, faceUpIndex } = data;
    const gameId = this.playerToGame.get(socket.id);
    const game = this.games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Jogo não encontrado' });
      return;
    }
    
    try {
      const card = game.drawTrainCard(socket.id, fromDeck, faceUpIndex);
      
      // Enviar carta para o jogador
      socket.emit('cardDrawn', {
        card: card,
        trainCards: game.getPlayerById(socket.id).trainCards
      });
      
      // Notificar todos sobre o estado atualizado
      this.io.to(gameId).emit('gameUpdated', {
        game: game.toJSON()
      });
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  claimRoute(socket, data) {
    const { routeId, cardsUsed } = data;
    const gameId = this.playerToGame.get(socket.id);
    const game = this.games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Jogo não encontrado' });
      return;
    }
    
    try {
      game.claimRoute(socket.id, routeId, cardsUsed);
      
      const player = game.getPlayerById(socket.id);
      
      // Notificar o jogador
      socket.emit('routeClaimed', {
        routeId: routeId,
        trainCards: player.trainCards,
        score: player.score
      });
      
      // Notificar todos sobre o estado atualizado
      this.io.to(gameId).emit('gameUpdated', {
        game: game.toJSON(),
        message: `${player.name} reivindicou uma rota!`
      });
      
      // Se o jogo terminou, notificar
      if (game.gameState === 'finished') {
        this.io.to(gameId).emit('gameEnded', {
          game: game.toJSON(),
          winner: game.players[0]
        });
      }
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  drawDestinationTickets(socket, data) {
    const gameId = this.playerToGame.get(socket.id);
    const game = this.games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Jogo não encontrado' });
      return;
    }
    
    try {
      const tickets = game.drawDestinationTickets(socket.id);
      
      // Enviar bilhetes para o jogador escolher
      socket.emit('destinationTicketsDrawn', {
        tickets: tickets
      });
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  returnDestinationTickets(socket, data) {
    const { ticketsToReturn, ticketsToKeep } = data;
    const gameId = this.playerToGame.get(socket.id);
    const game = this.games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Jogo não encontrado' });
      return;
    }
    
    try {
      game.returnDestinationTickets(socket.id, ticketsToReturn, ticketsToKeep);
      
      const player = game.getPlayerById(socket.id);
      
      // Notificar o jogador
      socket.emit('destinationTicketsKept', {
        destinationTickets: player.destinationTickets
      });
      
      // Notificar todos sobre o estado atualizado
      this.io.to(gameId).emit('gameUpdated', {
        game: game.toJSON()
      });
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  handleDisconnect(socket) {
    const gameId = this.playerToGame.get(socket.id);
    
    if (gameId) {
      const game = this.games.get(gameId);
      
      if (game) {
        const player = game.getPlayerById(socket.id);
        
        if (player) {
          // Notificar outros jogadores
          this.io.to(gameId).emit('playerDisconnected', {
            playerId: socket.id,
            playerName: player.name
          });
          
          // Se o jogo ainda não começou, remover o jogador
          if (game.gameState === 'waiting') {
            game.players = game.players.filter(p => p.id !== socket.id);
            
            // Se não sobrou ninguém, remover o jogo
            if (game.players.length === 0) {
              this.games.delete(gameId);
            }
          }
        }
      }
      
      this.playerToGame.delete(socket.id);
    }
  }

  getAllGames() {
    const gamesList = [];
    this.games.forEach((game, gameId) => {
      gamesList.push({
        id: gameId,
        playerCount: game.players.length,
        maxPlayers: 5,
        state: game.gameState
      });
    });
    return gamesList;
  }

  generateGameId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
