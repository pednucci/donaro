const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/pedidos', async (req, res) => {
    res.render('painel/meus-pedidos')
})

module.exports = router;