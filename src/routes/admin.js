const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/denuncias/campanhas', (req, res) => {
    res.render('adm/denuncias-pedidos')
})

router.get('/denuncias/campanhas/:id', (req, res) => {
    res.render('adm/denuncias-pedido')
})

router.get('/denuncias/naoentregues', (req, res) => {
    res.render('adm/pedidos-nao-entregues')
})

router.get('/denuncias/naoentregues/:id', (req, res) => {
    res.render('adm/pedido-nao-entregue')
})

router.get('/denuncias/usuarios', (req, res) => {
    res.render('adm/denuncias-usuarios')
})

router.get('/denuncias/usuarios/:id', (req, res) => {
    res.render('adm/denuncias-usuario')
})

module.exports = router;