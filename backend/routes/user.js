const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // package de prévention des forces brutes
const userCtrl = require('../controllers/user');


const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // Temps défini (en minutes) pour tester l'application
    max: 3 // essais max par adresse ip
  });

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;