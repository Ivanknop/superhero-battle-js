class CombatRules {
  initiativeScore(entity, luck) {
    return entity.initiative() + luck;
  }

  isAutomaticFailure(luck) {
    return luck === 1;
  }

  isAutomaticSuccess(luck) {
    return luck === 100;
  }

  isBlocked(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return false;
    if (this.isAutomaticSuccess(attackerLuck)) return false;

    const attackerSpeed = this.modifiedSpeed(attacker, attackerLuck);
    const defenderSpeed = this.modifiedSpeed(defender, defenderLuck);

    return defenderSpeed >= attackerSpeed * 2;
  }

  isCriticalHit(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return false;
    if (this.isAutomaticSuccess(attackerLuck)) return true;

    const attackerSpeed = this.modifiedSpeed(attacker, attackerLuck);
    const defenderSpeed = this.modifiedSpeed(defender, defenderLuck);

    return attackerSpeed >= defenderSpeed * 2;
  }

  criticalMultiplier(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticSuccess(attackerLuck)) return 3;
    if (this.isCriticalHit(attacker, defender, attackerLuck, defenderLuck)) return 2;
    return 1;
  }

  rollLuckPair(rng) {
    return {
      attackerLuck: rng.randint(1, 100),
      defenderLuck: rng.randint(1, 100),
    };
  }

  calculateBaseDamage(attacker, defender) {
    const rawDamage = attacker.offensivePower() - defender.defensivePower();
    return Math.max(1, rawDamage);
  }

  calculateTurnDamage(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return 0;
    const damage = this.calculateBaseDamage(attacker, defender);
    if (damage === 0) return 0;
    if (this.isBlocked(attacker, defender, attackerLuck, defenderLuck)) return 1;
    const finalDamage = damage * this.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck);
    return Math.max(1, Math.round(finalDamage * 100) / 100);
  }

  modifiedSpeed(entity, luck) {
    return entity.initiative() + luck;
  }
}

module.exports = CombatRules;
