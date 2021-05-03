const express = require('express');
const router = express.Router();

router.get('/criar', (req, res) => {
    res.render('pedidos/cadastrar-pedido')
})

module.exports = router