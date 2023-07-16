const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//routes POST pour créer un compte ou se connecter envoyé par le frontend
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//export du router
module.exports = router;