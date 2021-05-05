const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const { isAuth } = require('../helpers/isAuth');

router.get('/criar', isAuth, (req, res) => {
    res.render('pedidos/cadastrar-pedido')
})

router.post('/cadpedido', newOrderController.newOrder);

router.get('/cadaccept', (req, res) => {
    req.flash('successMsg', 'Pedido cadastrado com sucesso!')
    res.redirect('/');
})

router.get('/cadrecused', (req, res) => {
    req.flash('errorMsg', 'Ocorreu um erro ao cadastrar seu pedido!')
    res.redirect('/');
})

module.exports = router


