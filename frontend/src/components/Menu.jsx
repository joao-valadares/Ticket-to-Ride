import React, { useState } from 'react';

function Menu({ onCreateGame, onJoinGame }) {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState('create'); // 'create' or 'join'

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }

    if (mode === 'create') {
      onCreateGame(playerName.trim());
    } else {
      if (!gameId.trim()) {
        alert('Por favor, digite o código do jogo');
        return;
      }
      onJoinGame(gameId.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-card">
        <h1 className="menu-title">🚂 Ticket to Ride</h1>
        <h2 className="menu-subtitle">Brasil</h2>
        
        <form className="menu-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="menu-input"
            placeholder="Seu nome"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            required
          />
          
          {mode === 'join' && (
            <input
              type="text"
              className="menu-input"
              placeholder="Código do jogo"
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
          )}
          
          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
          >
            {mode === 'create' ? 'Criar Novo Jogo' : 'Entrar no Jogo'}
          </button>
        </form>
        
        <div className="menu-divider">ou</div>
        
        <button 
          className="btn-secondary"
          style={{ width: '100%' }}
          onClick={() => setMode(mode === 'create' ? 'join' : 'create')}
        >
          {mode === 'create' ? 'Entrar em um jogo existente' : 'Criar um novo jogo'}
        </button>
        
        <div style={{ marginTop: '30px', textAlign: 'center', color: '#7f8c8d' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
            Um jogo de estratégia para 2-5 jogadores
          </p>
          <p style={{ fontSize: '0.8rem' }}>
            Colete cartas, reivindique rotas e complete destinos!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Menu;
