const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dotenv = require("dotenv");
const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.error("Erreur de connexion à MongoDB :", error));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use(mongoSanitize());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // autorisation de ressources chargées depuis des domaines différents

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
