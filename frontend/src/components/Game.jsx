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
      // Aqui você pode abrir um modal para o jogador escolher os bilhetes
      showNotification('Escolha seus bilhetes de destino', 'info');
    });

    socketService.on('destinationTicketsKept', (data) => {
      setMyTickets(data.destinationTickets);
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
