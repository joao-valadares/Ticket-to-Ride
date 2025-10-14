export class Player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.trainCards = []; // Cartas de trem na mão
    this.destinationTickets = []; // Bilhetes de destino
    this.claimedRoutes = []; // Rotas reivindicadas
    this.trainPieces = 45; // Número inicial de peças de trem
    this.score = 0;
    this.longestPath = 0;
  }

  addTrainCard(card) {
    this.trainCards.push(card);
  }

  removeTrainCards(color, count) {
    const removed = [];
    let remaining = count;
    
    for (let i = this.trainCards.length - 1; i >= 0 && remaining > 0; i--) {
      if (this.trainCards[i] === color) {
        removed.push(this.trainCards.splice(i, 1)[0]);
        remaining--;
      }
    }
    
    return removed.length === count;
  }

  addDestinationTicket(ticket) {
    this.destinationTickets.push(ticket);
  }

  claimRoute(route) {
    this.claimedRoutes.push(route);
    this.trainPieces -= route.length;
    this.score += this.getPointsForRoute(route.length);
  }

  getPointsForRoute(length) {
    const pointsMap = {
      1: 1,
      2: 2,
      3: 4,
      4: 7,
      5: 10,
      6: 15,
      7: 18,
      8: 21
    };
    return pointsMap[length] || 0;
  }

  calculateFinalScore() {
    // Adicionar/subtrair pontos dos bilhetes de destino
    this.destinationTickets.forEach(ticket => {
      if (this.isDestinationComplete(ticket)) {
        this.score += ticket.points;
      } else {
        this.score -= ticket.points;
      }
    });
  }

  isDestinationComplete(ticket) {
    // Verificar se há uma rota contínua entre as duas cidades do bilhete
    return this.hasPathBetween(ticket.from, ticket.to);
  }

  hasPathBetween(city1, city2) {
    const visited = new Set();
    const queue = [city1];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current === city2) {
        return true;
      }
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      
      // Adicionar cidades conectadas à fila
      this.claimedRoutes.forEach(route => {
        if (route.city1 === current && !visited.has(route.city2)) {
          queue.push(route.city2);
        } else if (route.city2 === current && !visited.has(route.city1)) {
          queue.push(route.city1);
        }
      });
    }
    
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      trainCardsCount: this.trainCards.length,
      destinationTicketsCount: this.destinationTickets.length,
      claimedRoutes: this.claimedRoutes,
      trainPieces: this.trainPieces,
      score: this.score
    };
  }
}
