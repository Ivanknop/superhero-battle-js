const express = require("express");
const session = require("express-session");
const path = require("path");
const { initDatabase } = require("./src/model/handlerData");
const heroRoutes = require("./src/routes/heroRoutes");
const battleRoutes = require("./src/routes/battleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(
  session({
    secret: "hero-secret",
    resave: false,
    saveUninitialized: true,
  })
);

initDatabase();

app.use("/", heroRoutes);
app.use("/", battleRoutes);

app.listen(PORT, () => {
  console.log(`SuperHero Battle running on http://localhost:${PORT}`);
});
