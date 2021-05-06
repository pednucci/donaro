const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const auth = require('./routes/auth');
const pedido = require('./routes/pedido');
const admin = require('./routes/admin');
const notificacao = require('./routes/notificacao');
const { isAuth } = require('./helpers/isAuth');

router.get('/', (req, res) => {
    res.render('landing-page/index')
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('successMsg', "Deslogado")
    res.redirect('/')
})

router.use(auth);
router.use(pedido);
router.use('/admin', admin);
router.use('/notificacoes', isAuth, notificacao)

module.exports = router;