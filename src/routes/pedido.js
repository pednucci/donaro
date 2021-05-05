const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const { isAuth } = require('../helpers/isAuth');

router.get('/criar', isAuth, (req, res) => {
    res.render('pedidos/cadastrar-pedido')
})

router.post('/cadpedido', newOrderController.newOrder);

module.exports = router


