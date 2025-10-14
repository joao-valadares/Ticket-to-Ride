export class DestinationTicketDeck {
  constructor(tickets) {
    this.tickets = [...tickets];
    this.shuffle();
  }

  shuffle() {
    for (let i = this.tickets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tickets[i], this.tickets[j]] = [this.tickets[j], this.tickets[i]];
    }
  }

  drawTickets(count) {
    const drawn = [];
    for (let i = 0; i < count && this.tickets.length > 0; i++) {
      drawn.push(this.tickets.pop());
    }
    return drawn;
  }

  returnTickets(tickets) {
    // Devolver bilhetes não escolhidos ao fundo do baralho
    this.tickets.unshift(...tickets);
  }

  getTicketsRemaining() {
    return this.tickets.length;
  }

  toJSON() {
    return {
      ticketsRemaining: this.tickets.length
    };
  }
}
