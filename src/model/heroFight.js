const Fight = require("../core/fight");
const CombatRules = require("../core/combatRules");

class HeroFight extends Fight {
  constructor(fighterOne, fighterTwo, rng = null) {
    super(fighterOne, fighterTwo, new CombatRules(), rng);
  }

  turnText(attacker, defender, damage, attackerLuck, defenderLuck, defenderInitialVitality) {
    const attackerName = attacker.getName();
    const defenderName = defender.getName();
    const rules = this.getCombatRules();

    if (rules.isAutomaticFailure(attackerLuck)) {
      const frases = [
        `¡${attackerName} falló estrepitosamente!`,
        `¡El golpe de ${attackerName} no encontró su objetivo!`,
        `¡${attackerName} erró y quedó expuesto!`,
      ];
      return frases[Math.floor(Math.random() * frases.length)];
    }

    if (rules.isBlocked(attacker, defender, attackerLuck, defenderLuck)) {
      const frases = [
        `¡${defenderName} bloqueó el ataque de ${attackerName} y solo recibió ${damage} de daño!`,
        `¡${defenderName} anticipó el golpe y absorbió casi todo el impacto — ${damage} de daño!`,
        `¡Defensa magistral de ${defenderName}! ${attackerName} apenas le hizo ${damage}!`,
      ];
      return frases[Math.floor(Math.random() * frases.length)];
    }

    if (rules.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck) > 1) {
      const frases = [
        `¡GOLPE CRÍTICO! ¡${attackerName} destruye a ${defenderName} con ${damage} de daño!`,
        `¡${attackerName} desata todo su poder y aplasta a ${defenderName} por ${damage}!`,
        `¡IMPACTO DEVASTADOR de ${attackerName}! ¡${defenderName} sufre ${damage} de daño!`,
      ];
      return frases[Math.floor(Math.random() * frases.length)];
    }

    if (defenderInitialVitality <= 0) {
      return `¡${attackerName} remata a ${defenderName} con ${damage} de daño!`;
    }

    const damageRatio = damage / defenderInitialVitality;

    if (damageRatio > 0.5) {
      const frases = [
        `¡${attackerName} golpea con furia y arranca ${damage} de vida a ${defenderName}!`,
        `¡Brutal ataque de ${attackerName} causando ${damage} de daño a ${defenderName}!`,
        `¡${defenderName} tambalea tras recibir ${damage} de daño de ${attackerName}!`,
      ];
      return frases[Math.floor(Math.random() * frases.length)];
    }

    if (damageRatio < 0.1) {
      const frases = [
        `${attackerName} roza a ${defenderName} causando apenas ${damage} de daño.`,
        `Golpe débil de ${attackerName} — ${defenderName} apenas lo sintió. ${damage} de daño.`,
        `${attackerName} no logra penetrar la defensa de ${defenderName}. Solo ${damage} de daño.`,
      ];
      return frases[Math.floor(Math.random() * frases.length)];
    }

    const frases = [
      `¡${attackerName} conecta un sólido golpe causando ${damage} de daño a ${defenderName}!`,
      `¡${attackerName} avanza implacable e inflige ${damage} de daño a ${defenderName}!`,
      `¡Buen impacto de ${attackerName} sobre ${defenderName} por ${damage} de daño!`,
    ];
    return frases[Math.floor(Math.random() * frases.length)];
  }
}

module.exports = HeroFight;
