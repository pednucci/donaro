const express = require('express')
const router = express.Router();
const db = require('../database/database');

router.get('/cadastro', (req, res) => {
    res.render('login/cadastro')
})

router.post('/cadastro', async (req, res) => {

})

module.exports = router;

