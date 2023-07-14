const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const productRoutes = require('./routes/product');

const app = express();

mongoose.connect(
    "mongodb+srv://GregRgy:gpawn@cluster01.3ia81ri.mongodb.net/?retryWrites=true&w=majority", //Add your connection string from MongoDB
    { useNewUrlParser: true, 
      useUnifiedTopology: true })
      .then(() => console.log('Connection à MongoDB réussie'))
      .catch(() => console.log('Connection à MongoDB échouée'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
    console.log("Requête reçue !");
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({message: "Votre requête a bien été reçue !"});
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app;