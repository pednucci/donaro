const express = require('express')
const router = express.Router();
const db = require('../database/database');
const registerController = require('../controllers/registerController');

router.get('/cadastro', (req, res) => {
    res.render('login/cadastro')
})

router.post('/cadastro', registerController.register)

module.exports = router;

