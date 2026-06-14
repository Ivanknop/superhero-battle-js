const Database = require("better-sqlite3");
const path = require("path");
const Hero = require("./hero");

const dbPath = path.join(__dirname, "..", "..", "data", "heroes.db");
let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
  }
  return db;
}

function initDatabase() {
  const conn = getDb();
  conn.exec(`
    CREATE TABLE IF NOT EXISTS heroes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      strength REAL NOT NULL,
      intelligence REAL NOT NULL,
      hardness REAL NOT NULL,
      power REAL NOT NULL,
      combat REAL NOT NULL,
      speed REAL NOT NULL,
      hp REAL NOT NULL,
      total REAL NOT NULL
    )
  `);
}

function insertHero(name, strength, intelligence, hardness, power, speed, hp, combat, total) {
  const conn = getDb();
  const stmt = conn.prepare(`
    INSERT OR IGNORE INTO heroes (name, strength, intelligence, hardness, power, speed, hp, combat, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(name, strength, intelligence, hardness, power, speed, hp, combat, total);
}

function _toDomain(row) {
  if (!row) return null;
  const characteristics = {
    strength: row.strength,
    speed: row.speed,
    intelligence: row.intelligence,
    hardness: row.hardness,
    power: row.power,
    combat: row.combat,
    total: row.total,
  };
  return new Hero(row.name, row.hp, characteristics);
}

function showEntities(limit = 0, offset = 0) {
  const conn = getDb();
  let query = "SELECT * FROM heroes ORDER BY name ASC";
  const params = [];
  if (limit > 0) {
    query += " LIMIT ?";
    params.push(limit);
    if (offset > 0) {
      query += " OFFSET ?";
      params.push(offset);
    }
  }
  const rows = conn.prepare(query).all(...params);
  return rows.map(_toDomain);
}

function findEntity(name) {
  const conn = getDb();
  const row = conn.prepare("SELECT * FROM heroes WHERE name = ?").get(name);
  return _toDomain(row);
}

function randomEntityExcluding(name) {
  const conn = getDb();
  const rows = conn.prepare("SELECT * FROM heroes WHERE name != ?").all(name);
  if (rows.length === 0) return null;
  const row = rows[Math.floor(Math.random() * rows.length)];
  return _toDomain(row);
}

module.exports = {
  initDatabase,
  insertHero,
  showEntities,
  findEntity,
  randomEntityExcluding,
};
