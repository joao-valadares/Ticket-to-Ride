import React from 'react';

function PlayerHand({ cards, selectedCards, onCardSelect }) {
  console.log('🎴 PlayerHand renderizado');
  console.log('  - cards:', cards);
  console.log('  - selectedCards:', selectedCards);
  
  // Contar cartas por cor
  const cardCounts = cards.reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {});
  
  console.log('  - cardCounts:', cardCounts);

  const getCardColor = (color) => {
    const colorMap = {
      red: '#e74c3c',
      blue: '#3498db',
      green: '#2ecc71',
      yellow: '#f1c40f',
      black: '#34495e',
      white: '#ecf0f1',
      orange: '#e67e22',
      purple: '#9b59b6',
      locomotive: '#2c3e50'
    };
    return colorMap[color] || '#95a5a6';
  };

  return (
    <div className="cards-container">
      {Object.entries(cardCounts).map(([color, count]) => {
        // Verificar quantas cartas dessa cor estão selecionadas
        const selectedCard = selectedCards.find(c => c.color === color);
        const selectedCount = selectedCard ? selectedCard.count : 0;
        const isSelected = selectedCount > 0;
        
        console.log(`  📌 Renderizando carta ${color}:`, {
          totalCards: count,
          selectedCard,
          selectedCount,
          isSelected
        });

        return (
          <div key={color} style={{ position: 'relative' }}>
            <div
              className={`train-card card-${color} ${isSelected ? 'selected' : ''}`}
              onClick={() => onCardSelect(color)}
              style={{ 
                backgroundColor: getCardColor(color),
                position: 'relative',
                opacity: isSelected ? 0.8 : 1,
                transform: isSelected ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.2s ease'
              }}
            >
              {color === 'locomotive' ? '🚂' : color.toUpperCase()[0]}
            </div>
            
            {/* Badge com total de cartas */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#e74c3c',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              zIndex: 10
            }}>
              {count}
            </div>

            {/* Badge com cartas selecionadas */}
            {isSelected && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#2ecc71',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                ✓ {selectedCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PlayerHand;
