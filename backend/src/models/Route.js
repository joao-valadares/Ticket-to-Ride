export class Route {
  constructor(id, city1, city2, color, length) {
    this.id = id;
    this.city1 = city1;
    this.city2 = city2;
    this.color = color;
    this.length = length;
    this.claimedBy = null;
  }

  claim(playerId) {
    if (this.claimedBy) {
      throw new Error('Rota já foi reivindicada');
    }
    this.claimedBy = playerId;
  }

  isClaimed() {
    return this.claimedBy !== null;
  }

  connectsCity(cityId) {
    return this.city1 === cityId || this.city2 === cityId;
  }

  getOtherCity(cityId) {
    if (this.city1 === cityId) return this.city2;
    if (this.city2 === cityId) return this.city1;
    return null;
  }

  toJSON() {
    return {
      id: this.id,
      city1: this.city1,
      city2: this.city2,
      color: this.color,
      length: this.length,
      claimedBy: this.claimedBy
    };
  }
}
