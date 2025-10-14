import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socketService from '../services/socket';

function Lobby({ playerName }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Escutar eventos do jogo
    socketService.on('gameCreated', (data) => {
      setGame(data.game);
      setIsHost(true);
    });

    socketService.on('playerJoined', (data) => {
      setGame(data.game);
      // Verificar se o socket atual é o primeiro jogador (host)
      if (data.game.players.length > 0 && data.game.players[0].id === socketService.socket.id) {
        setIsHost(true);
      }
    });

    socketService.on('gameStarted', (data) => {
      console.log('Evento gameStarted recebido no Lobby:', data);
      navigate(`/game/${gameId}`);
    });

    socketService.on('playerDisconnected', (data) => {
      alert(`${data.playerName} saiu do jogo`);
    });

    // Limpar listeners ao desmontar
    // NÃO removemos 'gameStarted' pois o componente Game precisa dele
    return () => {
      socketService.off('gameCreated');
      socketService.off('playerJoined');
      socketService.off('playerDisconnected');
    };
  }, [gameId, navigate]);

  const handleStartGame = () => {
    if (game && game.players.length >= 2) {
      socketService.startGame(gameId);
    } else {
      alert('É necessário pelo menos 2 jogadores para começar');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameId);
    alert('Código copiado!');
  };

  if (!game) {
    return (
      <div className="lobby-container">
        <div className="lobby-card">
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <div className="lobby-header">
          <h1>Sala de Espera</h1>
          <div className="game-code">
            Código: {gameId}
            <button 
              onClick={handleCopyCode}
              className="btn-secondary"
              style={{ marginLeft: '10px', padding: '5px 15px', fontSize: '0.9rem' }}
            >
              📋 Copiar
            </button>
          </div>
          <p style={{ color: '#7f8c8d', marginTop: '10px' }}>
            Compartilhe este código com seus amigos
          </p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px' }}>
            Jogadores ({game.players.length}/5)
          </h3>
          <ul className="players-list">
            {game.players.map((player, index) => (
              <li 
                key={player.id} 
                className="player-item"
                style={{ borderLeftColor: player.color }}
              >
                <span className="player-name" style={{ color: player.color }}>
                  {player.name}
                </span>
                {index === 0 && <span className="player-host">HOST</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="lobby-actions">
          {isHost ? (
            <button 
              onClick={handleStartGame}
              className="btn-success"
              disabled={game.players.length < 2}
            >
              Iniciar Jogo
            </button>
          ) : (
            <div style={{ textAlign: 'center', width: '100%', padding: '15px' }}>
              <p style={{ color: '#7f8c8d' }}>
                Aguardando o host iniciar o jogo...
              </p>
            </div>
          )}
          <button 
            onClick={() => navigate('/')}
            className="btn-danger"
          >
            Sair
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px' }}>Como Jogar:</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#555' }}>
            <li>Colete cartas de trem da mesma cor</li>
            <li>Use as cartas para reivindicar rotas no mapa</li>
            <li>Complete seus bilhetes de destino conectando cidades</li>
            <li>O jogador com mais pontos ao final vence!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
