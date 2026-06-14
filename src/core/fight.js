const CombatRules = require("./combatRules");

class Fight {
  constructor(fighterOne, fighterTwo, combatRules = null, rng = null) {
    this._fighterOne = fighterOne;
    this._fighterTwo = fighterTwo;
    this._rng = rng || Math;
    this._combatRules = combatRules || new CombatRules();
  }

  getFighterOne() {
    return this._fighterOne;
  }

  getFighterTwo() {
    return this._fighterTwo;
  }

  getCombatRules() {
    return this._combatRules;
  }

  orderToHit(attackerLuck = 0, defenderLuck = 0) {
    const f1Initiative = this._combatRules.initiativeScore(
      this.getFighterOne(),
      attackerLuck
    );
    const f2Initiative = this._combatRules.initiativeScore(
      this.getFighterTwo(),
      defenderLuck
    );
    if (f1Initiative >= f2Initiative) {
      return [this.getFighterOne(), this.getFighterTwo()];
    }
    return [this.getFighterTwo(), this.getFighterOne()];
  }

  playTurn(attackerLuck = 0, defenderLuck = 0) {
    attackerLuck = parseInt(attackerLuck, 10);
    defenderLuck = parseInt(defenderLuck, 10);

    if (!this.bothFightersAreAlive()) {
      const w = this.winner();
      if (w === null) {
        return ["La batalla terminó sin vencedor."];
      }
      return ["La batalla ya terminó. Vencedor " + w.getName()];
    }

    const [firstAttacker, secondAttacker] = this.orderToHit(
      attackerLuck,
      defenderLuck
    );
    const events = [];
    events.push(
      this.attackOnce(firstAttacker, secondAttacker, attackerLuck, defenderLuck)
    );
    if (secondAttacker.isAlive()) {
      events.push(
        this.attackOnce(secondAttacker, firstAttacker, attackerLuck, defenderLuck)
      );
    }
    return events;
  }

  bothFightersAreAlive() {
    return this.getFighterTwo().isAlive() && this.getFighterOne().isAlive();
  }

  winner() {
    if (this.getFighterOne().isAlive() && !this.getFighterTwo().isAlive()) {
      return this.getFighterOne();
    }
    if (this.getFighterTwo().isAlive() && !this.getFighterOne().isAlive()) {
      return this.getFighterTwo();
    }
    return null;
  }

  attackOnce(attacker, defender, attackerLuck, defenderLuck) {
    const [aLuck, dLuck] = this.luckFor(attacker, attackerLuck, defenderLuck);
    const defenderInitialVitality = defender.getVitality();
    const damage = this._combatRules.calculateTurnDamage(
      attacker,
      defender,
      aLuck,
      dLuck
    );
    if (damage > 0) {
      defender.takeHit(damage);
    }
    return this.turnText(
      attacker,
      defender,
      damage,
      aLuck,
      dLuck,
      defenderInitialVitality
    );
  }

  luckFor(attacker, attackerLuck, defenderLuck) {
    if (attacker === this.getFighterOne()) {
      return [attackerLuck, defenderLuck];
    }
    return [defenderLuck, attackerLuck];
  }

  turnText(attacker, defender, damage, attackerLuck, defenderLuck, defenderInitialVitality) {
    throw new Error("Subclass must implement turnText()");
  }
}

module.exports = Fight;
