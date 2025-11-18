import { Player } from './Player.js';
import { Deck } from './Deck.js';
import { DestinationTicketDeck } from './DestinationTicketDeck.js';
import { routes, destinationTickets, cities } from '../data/brasilMap.js';

export class Game {
  constructor(gameId, hostPlayer) {
    this.id = gameId;
    this.players = [hostPlayer];
    this.currentPlayerIndex = 0;
    this.trainCardDeck = new Deck();
    this.destinationTicketDeck = new DestinationTicketDeck(destinationTickets);
    this.routes = routes.map(route => ({
      ...route,
      claimedBy: null
    }));
    this.gameState = 'waiting'; // waiting, playing, finished
    this.lastRound = false;
    this.finalTurnPlayer = null;
    this.longestPathPlayer = null;
    this.turnAction = null; // Rastrear ação do turno atual
    this.cardDrawnCount = 0; // Contador de cartas compradas no turno
  }

  addPlayer(player) {
    if (this.players.length >= 5) {
      throw new Error('Jogo já está cheio');
    }
    
    if (this.gameState !== 'waiting') {
      throw new Error('Jogo já começou');
    }
    
    this.players.push(player);
  }

  startGame() {
    if (this.players.length < 2) {
      throw new Error('É necessário pelo menos 2 jogadores para começar');
    }
    
    if (this.gameState !== 'waiting') {
      throw new Error('Jogo já começou');
    }
    
    // Distribuir cartas de trem iniciais (4 cartas para cada jogador)
    this.players.forEach(player => {
      for (let i = 0; i < 4; i++) {
        player.addTrainCard(this.trainCardDeck.drawCard());
      }
    });
    
    // Distribuir bilhetes de destino iniciais (cada jogador pega 3 e deve manter pelo menos 2)
    this.players.forEach(player => {
      const tickets = this.destinationTicketDeck.drawTickets(3);
      // Por enquanto, adiciona todos os 3 bilhetes (o jogador pode devolver 1 depois)
      tickets.forEach(ticket => player.addDestinationTicket(ticket));
    });
    
    // Embaralhar ordem dos jogadores
    this.shufflePlayers();
    
    this.gameState = 'playing';
    this.currentPlayerIndex = 0;
  }

  shufflePlayers() {
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.turnAction = null;
    this.cardDrawnCount = 0;
    
    // Verificar se é a última rodada
    if (this.lastRound && this.currentPlayerIndex === this.players.indexOf(this.finalTurnPlayer)) {
      this.endGame();
    }
  }

  drawTrainCard(playerId, fromDeck = true, faceUpIndex = null) {
    const player = this.getPlayerById(playerId);
    
    if (!player) {
      throw new Error('Jogador não encontrado');
    }
    
    if (this.getCurrentPlayer().id !== playerId) {
      throw new Error('Não é o turno deste jogador');
    }
    
    if (this.turnAction && this.turnAction !== 'drawCards') {
      throw new Error('Ação diferente já foi realizada neste turno');
    }
    
    if (this.cardDrawnCount >= 2) {
      throw new Error('Já comprou 2 cartas neste turno');
    }
    
    let card;
    
    if (fromDeck) {
      card = this.trainCardDeck.drawCard();
    } else {
      card = this.trainCardDeck.drawFaceUpCard(faceUpIndex);
      
      // Se pegou uma locomotiva da mesa, só pode pegar 1 carta
      if (card === 'locomotive') {
        this.cardDrawnCount = 2;
      }
    }
    
    if (!card) {
      throw new Error('Não há cartas disponíveis');
    }
    
    player.addTrainCard(card);
    this.turnAction = 'drawCards';
    this.cardDrawnCount++;
    
    // Se pegou 2 cartas, passar o turno
    if (this.cardDrawnCount >= 2) {
      this.nextTurn();
    }
    
    return card;
  }

  claimRoute(playerId, routeId, cardsUsed) {
    console.log('\n🛤️ === REIVINDICANDO ROTA ===');
    console.log('  RouteId:', routeId);
    console.log('  Cartas recebidas:', cardsUsed);
    
    const player = this.getPlayerById(playerId);
    
    if (!player) {
      throw new Error('Jogador não encontrado');
    }
    
    console.log('  Cartas do jogador:', player.trainCards);
    
    if (this.getCurrentPlayer().id !== playerId) {
      throw new Error('Não é o turno deste jogador');
    }
    
    if (this.turnAction) {
      throw new Error('Ação já foi realizada neste turno');
    }
    
    const route = this.routes.find(r => r.id === routeId);
    
    if (!route) {
      throw new Error('Rota não encontrada');
    }
    
    console.log('  Rota:', route.city1, '→', route.city2);
    console.log('  Cor da rota:', route.color);
    console.log('  Tamanho:', route.length);
    
    if (route.claimedBy) {
      throw new Error('Rota já foi reivindicada');
    }
    
    // Verificar se o jogador tem peças suficientes
    if (player.trainPieces < route.length) {
      throw new Error('Peças de trem insuficientes');
    }
    
    // Validar cartas usadas
    console.log('  🔍 Validando cartas...');
    if (!this.validateCards(cardsUsed, route)) {
      console.log('  ❌ Validação falhou!');
      throw new Error('Cartas inválidas para esta rota');
    }
    console.log('  ✅ Validação passou!');
    
    // Remover cartas do jogador - uma por uma respeitando as cores
    const cardCounts = {};
    cardsUsed.forEach(card => {
      cardCounts[card] = (cardCounts[card] || 0) + 1;
    });
    
    console.log('  📊 Cartas a remover:', cardCounts);
    
    // Verificar se o jogador tem todas as cartas
    for (const [color, count] of Object.entries(cardCounts)) {
      const playerHasCards = player.trainCards.filter(c => c === color).length;
      console.log(`  🔢 ${color}: precisa de ${count}, tem ${playerHasCards}`);
      if (playerHasCards < count) {
        console.log(`  ❌ Cartas insuficientes de ${color}!`);
        throw new Error(`Cartas insuficientes: você precisa de ${count} cartas ${color} mas tem apenas ${playerHasCards}`);
      }
    }
    
    // Remover cada cor individualmente
    console.log('  🗑️ Removendo cartas...');
    for (const [color, count] of Object.entries(cardCounts)) {
      console.log(`    Removendo ${count}x ${color}...`);
      if (!player.removeTrainCards(color, count)) {
        console.log(`    ❌ Falha ao remover ${color}!`);
        throw new Error(`Erro ao remover ${count} cartas ${color}`);
      }
      console.log(`    ✅ ${color} removidas!`);
    }
    console.log('  ✅ Todas as cartas removidas com sucesso!');
    
    // Descartar cartas usadas
    this.trainCardDeck.discardCards(cardsUsed);
    
    // Reivindicar rota
    route.claimedBy = playerId;
    player.claimRoute(route);
    
    console.log('  🎉 Rota reivindicada com sucesso!');
    console.log('  🎯 Nova pontuação:', player.score);
    console.log('  🚂 Peças restantes:', player.trainPieces);
    console.log('=== FIM REIVINDICAÇÃO ===\n');
    
    this.turnAction = 'claimRoute';
    
    // Verificar se o jogo deve entrar na última rodada
    if (player.trainPieces <= 2 && !this.lastRound) {
      this.lastRound = true;
      this.finalTurnPlayer = player;
    }
    
    this.nextTurn();
  }

  validateCards(cards, route) {
    console.log('    📋 Validação de cartas:');
    console.log('      Cartas:', cards);
    console.log('      Rota cor:', route.color);
    console.log('      Rota tamanho:', route.length);
    
    if (cards.length !== route.length) {
      console.log('      ❌ Tamanho diferente!');
      return false;
    }
    
    // Se a rota tem uma cor específica
    if (route.color !== 'gray') {
      console.log('      🎨 Rota colorida (não cinza)');
      // Todas as cartas devem ser da cor da rota ou locomotivas
      const isValid = cards.every(card => card === route.color || card === 'locomotive');
      console.log(`      ${isValid ? '✅' : '❌'} Validação: todas devem ser ${route.color} ou locomotive`);
      return isValid;
    }
    
    // Se a rota é cinza (qualquer cor), todas as cartas devem ser da mesma cor ou locomotivas
    console.log('      ⚪ Rota cinza (qualquer cor)');
    const nonLocomotiveCards = cards.filter(card => card !== 'locomotive');
    if (nonLocomotiveCards.length === 0) {
      console.log('      ✅ Todas são locomotivas - válido!');
      return true; // Todas são locomotivas
    }
    
    const color = nonLocomotiveCards[0];
    const isValid = nonLocomotiveCards.every(card => card === color);
    console.log(`      ${isValid ? '✅' : '❌'} Todas não-locomotivas são ${color}: ${isValid}`);
    return isValid;
  }

  drawDestinationTickets(playerId) {
    const player = this.getPlayerById(playerId);
    
    if (!player) {
      throw new Error('Jogador não encontrado');
    }
    
    if (this.getCurrentPlayer().id !== playerId) {
      throw new Error('Não é o turno deste jogador');
    }
    
    if (this.turnAction) {
      throw new Error('Ação já foi realizada neste turno');
    }
    
    const tickets = this.destinationTicketDeck.drawTickets(3);
    
    if (tickets.length === 0) {
      throw new Error('Não há bilhetes de destino disponíveis');
    }
    
    this.turnAction = 'drawTickets';
    
    // Retornar os bilhetes para o jogador escolher (deve manter pelo menos 1)
    return tickets;
  }

  returnDestinationTickets(playerId, ticketsToReturn, ticketsToKeep) {
    const player = this.getPlayerById(playerId);
    
    if (!player) {
      throw new Error('Jogador não encontrado');
    }
    
    if (ticketsToKeep.length < 1) {
      throw new Error('Deve manter pelo menos 1 bilhete de destino');
    }
    
    // Adicionar bilhetes mantidos ao jogador
    ticketsToKeep.forEach(ticket => player.addDestinationTicket(ticket));
    
    // Devolver bilhetes ao baralho
    if (ticketsToReturn.length > 0) {
      this.destinationTicketDeck.returnTickets(ticketsToReturn);
    }
    
    this.nextTurn();
  }

  endGame() {
    this.gameState = 'finished';
    
    // Calcular pontuações finais
    this.players.forEach(player => {
      player.calculateFinalScore();
    });
    
    // Determinar o jogador com o caminho mais longo
    this.calculateLongestPath();
    
    if (this.longestPathPlayer) {
      this.longestPathPlayer.score += 10;
    }
    
    // Ordenar jogadores por pontuação
    this.players.sort((a, b) => b.score - a.score);
  }

  calculateLongestPath() {
    let maxPath = 0;
    let playerWithLongest = null;
    
    this.players.forEach(player => {
      const longest = this.findLongestPathForPlayer(player);
      player.longestPath = longest;
      
      if (longest > maxPath) {
        maxPath = longest;
        playerWithLongest = player;
      }
    });
    
    this.longestPathPlayer = playerWithLongest;
  }

  findLongestPathForPlayer(player) {
    // Implementação simples de busca do caminho mais longo
    // Usar DFS para encontrar o caminho contínuo mais longo
    const routes = player.claimedRoutes;
    let maxLength = 0;
    
    routes.forEach(startRoute => {
      const visited = new Set();
      const length1 = this.dfsLongestPath(player, startRoute.city1, visited);
      visited.clear();
      const length2 = this.dfsLongestPath(player, startRoute.city2, visited);
      
      maxLength = Math.max(maxLength, length1, length2);
    });
    
    return maxLength;
  }

  dfsLongestPath(player, currentCity, visited) {
    visited.add(currentCity);
    let maxLength = 0;
    
    player.claimedRoutes.forEach(route => {
      let nextCity = null;
      
      if (route.city1 === currentCity && !visited.has(route.city2)) {
        nextCity = route.city2;
      } else if (route.city2 === currentCity && !visited.has(route.city1)) {
        nextCity = route.city1;
      }
      
      if (nextCity) {
        const length = route.length + this.dfsLongestPath(player, nextCity, new Set(visited));
        maxLength = Math.max(maxLength, length);
      }
    });
    
    return maxLength;
  }

  getPlayerById(playerId) {
    return this.players.find(p => p.id === playerId);
  }

  toJSON() {
    return {
      id: this.id,
      players: this.players.map(p => p.toJSON()),
      currentPlayerIndex: this.currentPlayerIndex,
      currentPlayer: this.getCurrentPlayer().toJSON(),
      trainCardDeck: this.trainCardDeck.toJSON(),
      destinationTicketDeck: this.destinationTicketDeck.toJSON(),
      routes: this.routes,
      cities: cities,
      gameState: this.gameState,
      lastRound: this.lastRound,
      winner: this.gameState === 'finished' ? this.players[0] : null
    };
  }
}
