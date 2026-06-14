const Entity = require("../core/entity");

class Hero extends Entity {
  constructor(name, vitality, characteristics) {
    super(name, vitality, characteristics);
  }

  offensivePower() {
    return (
      this.characteristics["strength"] * 0.6 +
      this.characteristics["combat"] * 0.4 +
      this.characteristics["power"] * 0.2
    );
  }

  defensivePower() {
    return (
      this.characteristics["hardness"] * 0.7 +
      this.characteristics["strength"] * 0.3
    );
  }

  initiative() {
    return (
      this.characteristics["speed"] +
      this.characteristics["intelligence"] * 0.5 +
      this.characteristics["combat"] * 0.5
    );
  }

  static fromDict(data) {
    const hero = new Hero(data.name, data.vitality, data.characteristics);
    hero.setVitality(data.vitality);
    return hero;
  }
}

module.exports = Hero;
