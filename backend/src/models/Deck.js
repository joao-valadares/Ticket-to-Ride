export class Deck {
  constructor() {
    this.cards = [];
    this.discardPile = [];
    this.faceUpCards = [];
    this.initializeDeck();
  }

  initializeDeck() {
    // Cores das cartas de trem
    const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple'];
    
    // 12 cartas de cada cor
    colors.forEach(color => {
      for (let i = 0; i < 12; i++) {
        this.cards.push(color);
      }
    });
    
    // 14 cartas coringa (locomotiva)
    for (let i = 0; i < 14; i++) {
      this.cards.push('locomotive');
    }
    
    this.shuffle();
    
    // Inicializar 5 cartas viradas para cima
    for (let i = 0; i < 5; i++) {
      this.faceUpCards.push(this.cards.pop());
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    if (this.cards.length === 0) {
      this.reshuffleDiscardPile();
    }
    return this.cards.pop();
  }

  drawFaceUpCard(index) {
    if (index < 0 || index >= this.faceUpCards.length) {
      return null;
    }
    
    const card = this.faceUpCards.splice(index, 1)[0];
    
    // Repor a carta virada para cima
    if (this.cards.length > 0) {
      this.faceUpCards.push(this.cards.pop());
    }
    
    // Verificar se há 3 ou mais locomotivas nas cartas viradas
    this.checkForThreeLocomotives();
    
    return card;
  }

  checkForThreeLocomotives() {
    const locomotiveCount = this.faceUpCards.filter(card => card === 'locomotive').length;
    
    if (locomotiveCount >= 3) {
      // Descartar todas as cartas viradas e pegar 5 novas
      this.discardPile.push(...this.faceUpCards);
      this.faceUpCards = [];
      
      for (let i = 0; i < 5 && this.cards.length > 0; i++) {
        this.faceUpCards.push(this.cards.pop());
      }
      
      // Verificar novamente recursivamente
      if (this.faceUpCards.filter(card => card === 'locomotive').length >= 3) {
        this.checkForThreeLocomotives();
      }
    }
  }

  reshuffleDiscardPile() {
    if (this.discardPile.length === 0) {
      return;
    }
    
    this.cards = [...this.discardPile];
    this.discardPile = [];
    this.shuffle();
  }

  discardCards(cards) {
    this.discardPile.push(...cards);
  }

  getCardsRemaining() {
    return this.cards.length;
  }

  toJSON() {
    return {
      cardsRemaining: this.cards.length,
      faceUpCards: this.faceUpCards,
      discardPileSize: this.discardPile.length
    };
  }
}
