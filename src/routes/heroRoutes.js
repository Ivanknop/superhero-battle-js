const { Router } = require("express");
const handlerData = require("../model/handlerData");

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/characters", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 0;
    const offset = parseInt(req.query.offset, 10) || 0;
    const data = handlerData.showEntities(limit, offset);
    res.render("table", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/choose-character", (req, res) => {
  try {
    const allHeroes = handlerData.showEntities();
    res.render("chooseCharacter", { hero_db: allHeroes });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
