import React from 'react';

// Importar dados do mapa
const cities = [
  { id: 'manaus', name: 'Manaus', x: 30, y: 15 },
  { id: 'belem', name: 'Belém', x: 50, y: 18 },
  { id: 'fortaleza', name: 'Fortaleza', x: 70, y: 22 },
  { id: 'natal', name: 'Natal', x: 75, y: 25 },
  { id: 'recife', name: 'Recife', x: 75, y: 30 },
  { id: 'salvador', name: 'Salvador', x: 70, y: 42 },
  { id: 'brasilia', name: 'Brasília', x: 50, y: 45 },
  { id: 'goiania', name: 'Goiânia', x: 48, y: 48 },
  { id: 'belo-horizonte', name: 'Belo Horizonte', x: 62, y: 52 },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', x: 65, y: 58 },
  { id: 'sao-paulo', name: 'São Paulo', x: 55, y: 60 },
  { id: 'curitiba', name: 'Curitiba', x: 52, y: 65 },
  { id: 'florianopolis', name: 'Florianópolis', x: 55, y: 70 },
  { id: 'porto-alegre', name: 'Porto Alegre', x: 50, y: 78 },
  { id: 'campo-grande', name: 'Campo Grande', x: 42, y: 52 },
  { id: 'cuiaba', name: 'Cuiabá', x: 38, y: 45 },
  { id: 'porto-velho', name: 'Porto Velho', x: 28, y: 30 },
  { id: 'rio-branco', name: 'Rio Branco', x: 18, y: 32 }
];

function GameBoard({ routes, onClaimRoute, canInteract, selectedCards }) {
  const getCityPosition = (cityId) => {
    const city = cities.find(c => c.id === cityId);
    return city ? { x: city.x, y: city.y } : { x: 50, y: 50 };
  };

  const getRouteStyle = (route) => {
    const city1Pos = getCityPosition(route.city1);
    const city2Pos = getCityPosition(route.city2);

    const dx = city2Pos.x - city1Pos.x;
    const dy = city2Pos.y - city1Pos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const colorMap = {
      red: '#e74c3c',
      blue: '#3498db',
      green: '#2ecc71',
      yellow: '#f1c40f',
      black: '#34495e',
      white: '#ecf0f1',
      orange: '#e67e22',
      purple: '#9b59b6',
      gray: '#95a5a6'
    };

    return {
      position: 'absolute',
      left: `${city1Pos.x}%`,
      top: `${city1Pos.y}%`,
      width: `${length}%`,
      height: '8px',
      backgroundColor: route.claimedBy ? colorMap[route.color] : colorMap[route.color],
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%',
      opacity: route.claimedBy ? 0.7 : 1,
      cursor: route.claimedBy ? 'not-allowed' : (canInteract ? 'pointer' : 'default'),
      border: route.claimedBy ? '2px solid #2c3e50' : 'none',
      boxShadow: route.claimedBy ? '0 0 10px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.2)'
    };
  };

  const handleRouteClick = (route) => {
    if (!canInteract || route.claimedBy) return;
    
    // Contar total de cartas selecionadas
    const totalSelected = selectedCards.reduce((sum, card) => sum + (card.count || 0), 0);
    
    if (totalSelected === 0) {
      alert(`Selecione ${route.length} cartas para reivindicar esta rota`);
      return;
    }
    
    if (totalSelected !== route.length) {
      alert(`Esta rota precisa de ${route.length} cartas (você selecionou ${totalSelected})`);
      return;
    }

    // Mostrar resumo das cartas selecionadas
    const cardsSummary = selectedCards
      .map(c => `${c.count}x ${c.color === 'locomotive' ? '🚂' : c.color.toUpperCase()}`)
      .join(' + ');

    if (confirm(`Reivindicar rota ${route.city1} → ${route.city2}?\n\nUsando: ${cardsSummary}`)) {
      onClaimRoute(route.id);
    }
  };

  return (
    <div className="brasil-map">
      {/* Mapa de fundo do Brasil - SVG real */}
      <div 
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%',
          opacity: 0.25,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img 
          src="/Brazil_Political_Map.svg" 
          alt="Mapa do Brasil" 
          style={{ 
            width: '90%', 
            height: '90%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Renderizar rotas */}
      {routes.map((route) => (
        <div
          key={route.id}
          className={`route ${route.claimedBy ? 'claimed' : ''}`}
          style={getRouteStyle(route)}
          onClick={() => handleRouteClick(route)}
          title={`${route.city1} → ${route.city2} (${route.length} peças - ${route.color})`}
        />
      ))}

      {/* Renderizar cidades */}
      {cities.map((city) => (
        <div
          key={city.id}
          className="city"
          style={{
            left: `${city.x}%`,
            top: `${city.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          title={city.name}
        >
          <div className="city-name">{city.name}</div>
        </div>
      ))}

      {/* Legenda melhorada */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '15px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '12px 15px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontSize: '0.85rem',
        border: '2px solid #ddd'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2c3e50' }}>
          🗺️ Legenda
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div>⚫ <span style={{ color: '#555' }}>Cidades</span></div>
          <div>━ <span style={{ color: '#555' }}>Rotas disponíveis</span></div>
          <div><strong>━</strong> <span style={{ color: '#555' }}>Rotas reivindicadas</span></div>
          <div style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #ddd', fontSize: '0.75rem', color: '#777' }}>
            💡 Clique nas rotas para reivindicar
          </div>
        </div>
      </div>

      {/* Informações do turno */}
      {canInteract && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(46, 204, 113, 0.95)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          fontWeight: 'bold',
          animation: 'pulse 2s infinite'
        }}>
          {(() => {
            const totalSelected = selectedCards.reduce((sum, card) => sum + (card.count || 0), 0);
            if (totalSelected === 0) {
              return '🎯 Sua vez! Clique nas cartas para selecionar';
            }
            const cardsSummary = selectedCards
              .map(c => `${c.count}x ${c.color === 'locomotive' ? '🚂' : c.color.toUpperCase()}`)
              .join(' + ');
            return `✓ Selecionadas: ${cardsSummary}`;
          })()}
        </div>
      )}
    </div>
  );
}

export default GameBoard;
