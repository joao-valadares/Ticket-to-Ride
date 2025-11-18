import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketService from '../services/socket';
import GameBoard from './GameBoard';
import PlayerHand from './PlayerHand';
import PlayersPanel from './PlayersPanel';
import DeckArea from './DeckArea';

function Game({ playerName, initialGameState }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(initialGameState);
  const [myCards, setMyCards] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [notification, setNotification] = useState(null);
  const [drawnTickets, setDrawnTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    console.log('Componente Game montado para gameId:', gameId);
    console.log('Estado inicial do jogo:', initialGameState);
    console.log('Socket conectado:', socketService.socket?.connected);
    
    // Se já temos o estado inicial, definir o game
    if (initialGameState && !game) {
      console.log('Usando estado inicial do jogo');
      setGame(initialGameState);
    }
    
    // Receber estado inicial do jogo quando ele começa (caso não tenha vindo via props)
    socketService.on('gameStarted', (data) => {
      console.log('Jogo iniciado no Game (via socket):', data.game);
      setGame(data.game);
    });

    // Receber estado inicial do jogo
    socketService.on('initialCards', (data) => {
      setMyCards(data.trainCards);
      setMyTickets(data.destinationTickets);
      console.log('Cartas iniciais recebidas:', data);
    });

    // Atualizações do jogo
    socketService.on('gameUpdated', (data) => {
      setGame(data.game);
      if (data.message) {
        showNotification(data.message, 'info');
      }
    });

    // Carta comprada
    socketService.on('cardDrawn', (data) => {
      setMyCards(data.trainCards);
      showNotification(`Você comprou uma carta ${data.card}`, 'success');
    });

    // Rota reivindicada
    socketService.on('routeClaimed', (data) => {
      setMyCards(data.trainCards);
      showNotification('Rota reivindicada com sucesso!', 'success');
    });

    // Bilhetes de destino
    socketService.on('destinationTicketsDrawn', (data) => {
      console.log('Bilhetes de destino recebidos:', data.tickets);
      setDrawnTickets(data.tickets);
      // Marcar todos como selecionados inicialmente (jogador pode desmarcar)
      setSelectedTickets(data.tickets.map((_, index) => index));
      showNotification('Escolha pelo menos 1 bilhete de destino', 'info');
    });

    socketService.on('destinationTicketsKept', (data) => {
      setMyTickets(data.destinationTickets);
      setDrawnTickets([]);
      setSelectedTickets([]);
      showNotification('Bilhetes de destino adicionados!', 'success');
    });

    // Fim do jogo
    socketService.on('gameEnded', (data) => {
      showNotification(`Jogo finalizado! Vencedor: ${data.winner.name}`, 'success');
      setTimeout(() => {
        navigate('/');
      }, 5000);
    });

    // Limpeza
    return () => {
      socketService.off('gameStarted');
      socketService.off('initialCards');
      socketService.off('gameUpdated');
      socketService.off('cardDrawn');
      socketService.off('routeClaimed');
      socketService.off('destinationTicketsDrawn');
      socketService.off('destinationTicketsKept');
      socketService.off('gameEnded');
    };
  }, [navigate]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDrawCard = (fromDeck, faceUpIndex = null) => {
    socketService.drawTrainCard(fromDeck, faceUpIndex);
  };

  const handleClaimRoute = (routeId) => {
    const route = game?.routes?.find(r => r.id === routeId);
    if (!route) return;

    // Contar cartas selecionadas
    const selectedCount = selectedCards.reduce((sum, card) => sum + (card.count || 0), 0);
    
    if (selectedCount === 0) {
      showNotification('Selecione as cartas para usar', 'error');
      return;
    }

    if (selectedCount !== route.length) {
      showNotification(`Esta rota precisa de exatamente ${route.length} cartas`, 'error');
      return;
    }

    // Validar se as cartas são válidas para a rota
    const validation = validateCardsForRoute(selectedCards, route);
    if (!validation.valid) {
      showNotification(validation.message, 'error');
      return;
    }

    // Converter selectedCards para array simples de cores para enviar ao servidor
    const cardsToSend = [];
    selectedCards.forEach(card => {
      for (let i = 0; i < card.count; i++) {
        cardsToSend.push(card.color);
      }
    });

    socketService.claimRoute(routeId, cardsToSend);
    setSelectedCards([]);
  };

  // Validar se as cartas selecionadas podem ser usadas na rota
  const validateCardsForRoute = (selectedCards, route) => {
    const totalCards = selectedCards.reduce((sum, c) => sum + c.count, 0);
    
    if (totalCards !== route.length) {
      return { valid: false, message: `Precisa selecionar ${route.length} cartas` };
    }

    // Contar locomotivas
    const locomotives = selectedCards.find(c => c.color === 'locomotive')?.count || 0;
    const nonLocomotives = selectedCards.filter(c => c.color !== 'locomotive');

    // Rota cinza aceita qualquer cor única + locomotivas
    if (route.color === 'gray') {
      if (nonLocomotives.length === 0) {
        // Só locomotivas - válido
        return { valid: true };
      }
      if (nonLocomotives.length === 1) {
        // Uma cor + locomotivas - válido
        return { valid: true };
      }
      // Mais de uma cor - inválido
      return { valid: false, message: 'Rota cinza: use apenas uma cor + Locomotivas' };
    }

    // Rota colorida - precisa da cor específica + locomotivas
    const routeColorCards = selectedCards.find(c => c.color === route.color)?.count || 0;
    
    if (routeColorCards + locomotives === route.length) {
      return { valid: true };
    }

    return { 
      valid: false, 
      message: `Esta rota precisa de cartas ${route.color.toUpperCase()} (Locomotivas servem como coringa)` 
    };
  };

  const handleCardSelect = (card) => {
    console.log('🎴 Clicou na carta:', card);
    console.log('🃏 myCards disponíveis:', myCards);
    console.log('✅ Cartas já selecionadas:', selectedCards);
    
    setSelectedCards(prev => {
      // Contar quantas cartas dessa cor o jogador tem
      const maxCount = myCards.filter(c => c === card).length;
      console.log(`📊 Você tem ${maxCount} cartas ${card}`);
      
      // Verificar se já existe essa cor selecionada
      const existingIndex = prev.findIndex(c => c.color === card);
      
      if (existingIndex > -1) {
        // Já existe - aumentar ou remover
        const updated = [...prev];
        const currentCount = updated[existingIndex].count;
        console.log(`🔢 Atualmente selecionadas: ${currentCount} de ${maxCount}`);
        
        if (currentCount >= maxCount) {
          // Já selecionou todas - desselecionar completamente
          console.log('❌ Desmarcando todas as cartas', card);
          return prev.filter((_, i) => i !== existingIndex);
        } else {
          // Aumentar quantidade
          const newCount = currentCount + 1;
          console.log(`➕ Aumentando para ${newCount}`);
          updated[existingIndex] = { color: card, count: newCount };
          return updated;
        }
      } else {
        // Não existe - adicionar com count 1
        console.log('🆕 Primeira seleção de', card);
        return [...prev, { color: card, count: 1 }];
      }
    });
  };

  const handleTicketToggle = (index) => {
    setSelectedTickets(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleConfirmTickets = () => {
    if (selectedTickets.length < 1) {
      showNotification('Você deve manter pelo menos 1 bilhete!', 'error');
      return;
    }

    const ticketsToKeep = selectedTickets.map(index => drawnTickets[index]);
    const ticketsToReturn = drawnTickets.filter((_, index) => !selectedTickets.includes(index));

    console.log('Mantendo bilhetes:', ticketsToKeep);
    console.log('Devolvendo bilhetes:', ticketsToReturn);

    socketService.returnDestinationTickets(ticketsToReturn, ticketsToKeep);
  };

  const isMyTurn = () => {
    if (!game) return false;
    return game.currentPlayer.id === socketService.socket.id;
  };

  if (!game) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Carregando jogo...
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Header com informações do jogo e jogadores */}
      <div className="game-header">
        <div className="header-left">
          <h2>Ticket to Ride - Brasil</h2>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Código: {gameId}</p>
        </div>
        
        <div className="header-players">
          <PlayersPanel 
            players={game.players}
            currentPlayerId={game.currentPlayer.id}
            compact={true}
          />
        </div>
        
        <div className="header-right">
          <div className={`turn-indicator ${isMyTurn() ? 'your-turn' : ''}`}>
            {isMyTurn() ? '🎯 SUA VEZ!' : `Turno de ${game.currentPlayer.name}`}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="btn-danger"
            style={{ marginTop: '8px' }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Mapa - Ocupa todo espaço disponível */}
      <div className="map-container">
        <GameBoard 
          routes={game.routes}
          cities={game.cities || []}
          onClaimRoute={handleClaimRoute}
          canInteract={isMyTurn()}
          selectedCards={selectedCards}
        />
      </div>

      {/* Sidebar Direita - Baralhos e Mão do Jogador */}
      <div className="sidebar-right">
        <DeckArea 
          trainCardDeck={game.trainCardDeck}
          destinationTicketDeck={game.destinationTicketDeck}
          onDrawCard={handleDrawCard}
          onDrawTickets={() => socketService.drawDestinationTickets()}
          canInteract={isMyTurn()}
          myTickets={myTickets}
        />
        
        <div className="player-hand-sidebar">
          <h3 style={{ marginBottom: '10px' }}>Suas Cartas ({myCards.length})</h3>
          <PlayerHand 
            cards={myCards}
            selectedCards={selectedCards}
            onCardSelect={handleCardSelect}
          />
        </div>
      </div>

      {/* Modal de Bilhetes de Destino */}
      {drawnTickets.length > 0 && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h2>Escolha seus Bilhetes de Destino</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
              Você deve manter pelo menos 1 bilhete. Clique para selecionar/desselecionar.
            </p>
            
            <div className="tickets-selection">
              {drawnTickets.map((ticket, index) => (
                <div
                  key={index}
                  className={`destination-ticket-modal ${selectedTickets.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleTicketToggle(index)}
                  style={{
                    cursor: 'pointer',
                    padding: '15px',
                    margin: '10px 0',
                    border: selectedTickets.includes(index) ? '3px solid #27ae60' : '2px solid #95a5a6',
                    borderRadius: '8px',
                    background: selectedTickets.includes(index) ? '#d4edda' : '#ecf0f1',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{ticket.from} → {ticket.to}</strong>
                      <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '5px' }}>
                        Pontos: {ticket.points}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>
                      {selectedTickets.includes(index) ? '✅' : '⬜'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px', color: selectedTickets.length < 1 ? '#e74c3c' : '#27ae60' }}>
                <strong>{selectedTickets.length}</strong> de {drawnTickets.length} bilhetes selecionados
              </p>
              <button
                onClick={handleConfirmTickets}
                className="btn-primary"
                disabled={selectedTickets.length < 1}
                style={{
                  padding: '12px 30px',
                  fontSize: '1rem',
                  opacity: selectedTickets.length < 1 ? 0.5 : 1,
                  cursor: selectedTickets.length < 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Confirmar Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificação */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default Game;
