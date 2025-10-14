import React from 'react';

function DeckArea({ trainCardDeck, destinationTicketDeck, onDrawCard, onDrawTickets, canInteract, myTickets }) {
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
    <div className="deck-area">
      {/* Cartas de Trem */}
      <div className="deck-section">
        <div className="deck-title">Cartas de Trem</div>
        
        {/* Baralho */}
        <div 
          className="deck-pile"
          onClick={() => canInteract && onDrawCard(true)}
          style={{ 
            cursor: canInteract ? 'pointer' : 'not-allowed',
            marginBottom: '10px'
          }}
        >
          <div>
            <div style={{ fontSize: '1.5rem' }}>🎴</div>
            <div style={{ fontSize: '0.8rem' }}>{trainCardDeck.cardsRemaining}</div>
          </div>
        </div>

        {/* Cartas Viradas */}
        <div className="deck-title" style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Cartas Abertas:
        </div>
        <div className="face-up-cards">
          {trainCardDeck.faceUpCards.map((card, index) => (
            <div
              key={index}
              className={`deck-card card-${card}`}
              onClick={() => canInteract && onDrawCard(false, index)}
              style={{ 
                backgroundColor: getCardColor(card),
                cursor: canInteract ? 'pointer' : 'not-allowed',
                color: ['white', 'yellow'].includes(card) ? '#333' : 'white'
              }}
            >
              {card === 'locomotive' ? '🚂' : card.toUpperCase()[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Bilhetes de Destino */}
      <div className="deck-section">
        <div className="deck-title">Bilhetes de Destino</div>
        
        <div 
          className="deck-pile"
          onClick={() => canInteract && onDrawTickets()}
          style={{ 
            cursor: canInteract ? 'pointer' : 'not-allowed',
            background: '#f1c40f',
            color: '#2c3e50',
            marginBottom: '15px'
          }}
        >
          <div>
            <div style={{ fontSize: '1.5rem' }}>🎫</div>
            <div style={{ fontSize: '0.8rem' }}>
              {destinationTicketDeck.ticketsRemaining}
            </div>
          </div>
        </div>

        {/* Meus Bilhetes */}
        {myTickets.length > 0 && (
          <>
            <div className="deck-title" style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Meus Destinos:
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {myTickets.map((ticket, index) => (
                <div key={index} className="destination-ticket">
                  <div className="ticket-route">
                    {ticket.from} → {ticket.to}
                  </div>
                  <span className="ticket-points">{ticket.points} pts</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Ações */}
      {canInteract && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          background: '#d4edda',
          borderRadius: '8px',
          fontSize: '0.9rem',
          textAlign: 'center',
          color: '#155724'
        }}>
          <strong>É sua vez!</strong>
          <br />
          Compre cartas ou reivindique uma rota
        </div>
      )}
    </div>
  );
}

export default DeckArea;
