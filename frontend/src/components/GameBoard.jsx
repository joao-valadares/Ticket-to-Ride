import React from 'react';

// =========================================================================
// GAMEBOARD - RENDERIZAÇÃO DO MAPA DO BRASIL
// =========================================================================
// 
// SISTEMA DE COORDENADAS:
// - Recebe cities[] e routes[] do backend via props
// - Coordenadas em PERCENTUAL (0-100) relativas ao container .brasil-map
// - Cidades: posicionadas com position: absolute usando left/top em %
// - Rotas: linhas conectando duas cidades, calculadas dinamicamente
// 
// CÁLCULO DE POSICIONAMENTO DAS ROTAS:
// 1. dx = x2 - x1 (diferença horizontal)
// 2. dy = y2 - y1 (diferença vertical)
// 3. length = √(dx² + dy²) (teorema de Pitágoras)
// 4. angle = atan2(dy, dx) * 180/π (ângulo em graus)
// 5. Aplicar: transform: rotate(angle) com transformOrigin: '0 50%'
// 
// PARA AJUSTAR POSIÇÕES:
// - Edite backend/src/data/brasilMap.js
// - Ajuste coordenadas x,y das cidades
// - As rotas se recalcularão automaticamente
// - NÃO ajuste as rotas diretamente
// =========================================================================

function GameBoard({ routes, cities = [], onClaimRoute, canInteract, selectedCards }) {
  // Validação: se cities não foi fornecido, retornar mensagem de erro
  if (!cities || cities.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: '#e74c3c',
        fontWeight: 'bold'
      }}>
        Aguardando dados do mapa...
      </div>
    );
  }

  const getCityPosition = (cityId) => {
    const city = cities.find(c => c.id === cityId);
    return city ? { x: city.x, y: city.y } : { x: 50, y: 50 };
  };

  const getRouteStyle = (route) => {
    const city1Pos = getCityPosition(route.city1);
    const city2Pos = getCityPosition(route.city2);

    // Cálculo da linha conectando duas cidades
    const dx = city2Pos.x - city1Pos.x;  // Diferença horizontal
    const dy = city2Pos.y - city1Pos.y;  // Diferença vertical
    const length = Math.sqrt(dx * dx + dy * dy);  // Comprimento (Pitágoras)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);  // Ângulo de rotação

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
