import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController.js';
import DatabaseService from './services/DatabaseService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Inicializar o controlador do jogo
const gameController = new GameController(io);

// Rotas REST
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Ticket to Ride - Brasil está rodando!' });
});

app.get('/api/games', (req, res) => {
  res.json({ games: gameController.getAllGames() });
});

// WebSocket - Gerenciamento de eventos do jogo
io.on('connection', (socket) => {
  console.log(`Jogador conectado: ${socket.id}`);

  socket.on('createGame', (data) => {
    gameController.createGame(socket, data);
  });

  socket.on('joinGame', (data) => {
    gameController.joinGame(socket, data);
  });

  socket.on('startGame', (data) => {
    gameController.startGame(socket, data);
  });

  socket.on('drawTrainCard', (data) => {
    gameController.drawTrainCard(socket, data);
  });

  socket.on('claimRoute', (data) => {
    gameController.claimRoute(socket, data);
  });

  socket.on('drawDestinationTickets', (data) => {
    gameController.drawDestinationTickets(socket, data);
  });

  socket.on('returnDestinationTickets', (data) => {
    gameController.returnDestinationTickets(socket, data);
  });

  socket.on('disconnect', () => {
    console.log(`Jogador desconectado: ${socket.id}`);
    gameController.handleDisconnect(socket);
  });
});

httpServer.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 WebSocket disponível em ws://localhost:${PORT}`);
  console.log(`🎮 Frontend: http://localhost:3000`);
  
  // Testar conexão com banco de dados
  console.log('\n📊 Testando conexão com banco de dados...');
  const dbConnected = await DatabaseService.testConnection();
  
  if (!dbConnected) {
    console.log('\n⚠️  AVISO: Servidor rodando SEM conexão com banco de dados!');
    console.log('   O jogo funcionará, mas dados não serão salvos.');
  }
  
  console.log('\n✅ Servidor pronto para receber conexões!\n');
});
