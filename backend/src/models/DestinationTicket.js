export class DestinationTicket {
  constructor(id, from, to, points) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.points = points;
  }

  isComplete(player) {
    return player.hasPathBetween(this.from, this.to);
  }

  getDescription() {
    return `${this.from} → ${this.to}`;
  }

  toJSON() {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      points: this.points
    };
  }
}
