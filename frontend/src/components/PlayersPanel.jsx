import React from 'react';

function PlayersPanel({ players, currentPlayerId }) {
  return (
    <div className="players-panel">
      <h3 style={{ marginBottom: '15px' }}>Jogadores</h3>
      {players.map((player) => (
        <div 
          key={player.id}
          className={`player-info ${player.id === currentPlayerId ? 'active' : ''}`}
          style={{ borderLeftColor: player.color }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center' 
          }}>
            <span style={{ 
              fontWeight: 'bold',
              color: player.color 
            }}>
              {player.name}
            </span>
            <span style={{ 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              {player.score}pts
            </span>
          </div>
          <div className="player-stats">
            <span>🚂 {player.trainPieces} peças</span>
            <span>🎴 {player.trainCardsCount} cartas</span>
            <span>🎫 {player.destinationTicketsCount} bilhetes</span>
          </div>
          <div style={{ 
            marginTop: '5px',
            fontSize: '0.8rem',
            color: '#7f8c8d'
          }}>
            Rotas: {player.claimedRoutes.length}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlayersPanel;
