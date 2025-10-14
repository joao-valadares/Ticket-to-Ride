import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import Game from './components/Game';
import socketService from './services/socket';
import './App.css';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Conectar ao servidor WebSocket
    socketService.connect();

    // Escutar evento gameStarted globalmente
    socketService.on('gameStarted', (data) => {
      console.log('gameStarted recebido no App:', data);
      setGameState(data.game);
    });

    // Limpar ao desmontar
    return () => {
      socketService.off('gameStarted');
      socketService.disconnect();
    };
  }, []);

  const handleCreateGame = (name) => {
    setPlayerName(name);
    socketService.createGame(name);
    
    socketService.on('gameCreated', (data) => {
      setGameId(data.gameId);
      navigate(`/lobby/${data.gameId}`);
    });
  };

  const handleJoinGame = (id, name) => {
    setPlayerName(name);
    setGameId(id);
    socketService.joinGame(id, name);
    navigate(`/lobby/${id}`);
  };

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            <Menu 
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
            />
          } 
        />
        <Route 
          path="/lobby/:gameId" 
          element={
            <Lobby 
              gameId={gameId}
              playerName={playerName}
            />
          } 
        />
        <Route 
          path="/game/:gameId" 
          element={
            <Game 
              gameId={gameId}
              playerName={playerName}
              initialGameState={gameState}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
