const express = require('express');
const router = express.Router();

router.get('/descobrir/pedido/:id/denuncia', (req, res) => {
    res.render('denuncias/denuncia-pedido')
})

router.get('/painel/pedido/:pedido/:soli/naoentregue', (req, res) => {
    res.render('denuncias/nao-entregue')
})

router.get('/usuario/:id/denuncia', (req, res) => {
    res.render('denuncias/denuncia-usuario')
})

module.exports = router;