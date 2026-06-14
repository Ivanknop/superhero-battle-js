const { Router } = require("express");
const Hero = require("../model/hero");
const HeroFight = require("../model/heroFight");
const CombatRules = require("../core/combatRules");
const handlerData = require("../model/handlerData");

const router = Router();
const combatRules = new CombatRules();

router.get("/start-fight", (req, res) => {
  try {
    const playerName = req.query.player;
    const playerEntity = handlerData.findEntity(playerName);
    const opponent = handlerData.randomEntityExcluding(playerName);

    req.session.fighter_one = playerEntity.toDict();
    req.session.fighter_two = opponent.toDict();
    req.session.events = [];
    req.session.finished = false;
    req.session.winner = null;
    req.session.winner_role = null;
    req.session.attacker_luck = 0;
    req.session.defender_luck = 0;
    req.session.pending_attacker_luck = null;
    req.session.pending_defender_luck = null;
    req.session.luck_used_this_turn = false;

    res.redirect("/fight");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/fight", (req, res) => {
  try {
    const fighterOne = req.session.fighter_one;
    const fighterTwo = req.session.fighter_two;
    if (!fighterOne || !fighterTwo) {
      return res.redirect("/choose-character");
    }
    res.render("fight", {
      fighter_one: fighterOne,
      fighter_two: fighterTwo,
      events: req.session.events || [],
      finished: req.session.finished || false,
      winner: req.session.winner || null,
      winner_role: req.session.winner_role || null,
      attacker_luck: req.session.attacker_luck || 0,
      defender_luck: req.session.defender_luck || 0,
      pending_attacker_luck: req.session.pending_attacker_luck || null,
      pending_defender_luck: req.session.pending_defender_luck || null,
      luck_used_this_turn: req.session.luck_used_this_turn || false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post("/fight/next", (req, res) => {
  try {
    const fighterOneData = req.session.fighter_one;
    const fighterTwoData = req.session.fighter_two;
    if (!fighterOneData || !fighterTwoData) {
      return res.redirect("/choose-character");
    }

    const fighterOne = Hero.fromDict(fighterOneData);
    const fighterTwo = Hero.fromDict(fighterTwoData);
    const battle = new HeroFight(fighterOne, fighterTwo);

    const attackerLuck = parseInt(req.session.attacker_luck || 0, 10);
    const defenderLuck = parseInt(req.session.defender_luck || 0, 10);

    const result = battle.playTurn(attackerLuck, defenderLuck);

    req.session.fighter_one = fighterOne.toDict();
    req.session.fighter_two = fighterTwo.toDict();

    const events = req.session.events || [];
    for (let i = result.length - 1; i >= 0; i--) {
      events.unshift(result[i]);
    }
    req.session.events = events;

    const winner = battle.winner();
    if (winner !== null) {
      req.session.finished = true;
      req.session.winner = winner.getName();
      req.session.winner_role =
        winner.getName() === fighterOne.getName() ? "Jugador" : "Rival";
    }

    req.session.attacker_luck = 0;
    req.session.defender_luck = 0;
    req.session.pending_attacker_luck = null;
    req.session.pending_defender_luck = null;
    req.session.luck_used_this_turn = false;

    res.redirect("/fight");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post("/fight/luck", (req, res) => {
  try {
    const luckPair = combatRules.rollLuckPair({
      randint: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      name: "random",
    });

    req.session.pending_attacker_luck = luckPair.attackerLuck;
    req.session.pending_defender_luck = luckPair.defenderLuck;
    req.session.luck_used_this_turn = true;

    res.redirect("/fight");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post("/fight/luck/accept", (req, res) => {
  try {
    req.session.attacker_luck = req.session.pending_attacker_luck || 0;
    req.session.defender_luck = req.session.pending_defender_luck || 0;
    req.session.pending_attacker_luck = null;
    req.session.pending_defender_luck = null;

    res.redirect("/fight");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post("/fight/luck/reject", (req, res) => {
  try {
    req.session.pending_attacker_luck = null;
    req.session.pending_defender_luck = null;

    res.redirect("/fight");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
