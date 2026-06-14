const fs = require("fs");
const path = require("path");
const { initDatabase, insertHero } = require("../src/model/handlerData");

const csvPath = path.join(__dirname, "superheroes.csv");

function fill() {
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = lines[0].trim().split(",");

  const nameIdx = headers.indexOf("name");
  const intelligenceIdx = headers.indexOf("intelligence");
  const strengthIdx = headers.indexOf("strength");
  const speedIdx = headers.indexOf("speed");
  const hardnessIdx = headers.indexOf("hardness");
  const powerIdx = headers.indexOf("power");
  const combatIdx = headers.indexOf("combat");
  const totalIdx = headers.indexOf("total");
  const hpIdx = headers.indexOf("hp");

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].trim().split(",");
    insertHero(
      cols[nameIdx],
      parseFloat(cols[strengthIdx]),
      parseFloat(cols[intelligenceIdx]),
      parseFloat(cols[hardnessIdx]),
      parseFloat(cols[powerIdx]),
      parseFloat(cols[speedIdx]),
      parseFloat(cols[hpIdx]),
      parseFloat(cols[combatIdx]),
      parseFloat(cols[totalIdx])
    );
  }
}

initDatabase();
fill();
console.log("Base de datos creada y cargada correctamente.");
