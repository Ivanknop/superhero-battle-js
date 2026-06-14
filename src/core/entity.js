class Entity {
  constructor(name, vitality, characteristics) {
    if (typeof name !== "string" || name.length === 0) {
      throw new Error("name should be a non-empty string");
    }
    if (typeof vitality !== "number") {
      throw new TypeError("vitality should be a number");
    }
    if (typeof characteristics !== "object" || characteristics === null) {
      throw new TypeError("characteristics should be an object");
    }
    this.name = name;
    this.vitality = vitality;
    this.initialVitality = vitality;
    this.characteristics = characteristics;
  }

  getName() {
    return this.name;
  }

  getCharacteristics() {
    return this.characteristics;
  }

  getVitality() {
    return this.vitality;
  }

  getInitialVitality() {
    return this.initialVitality;
  }

  takeHit(damage) {
    this.vitality = Math.max(0, this.vitality - damage);
  }

  isAlive() {
    return this.vitality > 0;
  }

  updateVitality(energy) {
    this.vitality += energy;
  }

  setVitality(newVitality) {
    this.vitality = Math.max(0, newVitality);
  }

  toDict() {
    return {
      name: this.getName(),
      vitality: this.getVitality(),
      initialVitality: this.getInitialVitality(),
      characteristics: this.getCharacteristics(),
    };
  }

  offensivePower() {
    throw new Error("Subclass must implement offensivePower()");
  }

  defensivePower() {
    throw new Error("Subclass must implement defensivePower()");
  }

  initiative() {
    throw new Error("Subclass must implement initiative()");
  }

  static fromDict(data) {
    throw new Error("Subclass must implement fromDict()");
  }
}

module.exports = Entity;
