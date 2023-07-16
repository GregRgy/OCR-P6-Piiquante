const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://GregRgy:gpawn@cluster01.3ia81ri.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true,
     useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json()); 

app.use(mongoSanitize()); 
app.use(helmet()); 

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));


app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
    

module.exports = app;