const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const auth = require('./routes/auth');
const pedido = require('./routes/pedido');
const admin = require('./routes/admin');
const notificacao = require('./routes/notificacao');
const painel = require('./routes/painel');
const chat = require('./routes/chat');
const denuncia = require('./routes/denuncia');
const { isAuth } = require('./helpers/isAuth');
const { isAdmin } = require('./helpers/isAdmin');

router.get('/', (req, res) => {
    res.render('landing-page/index')
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

router.use(auth);
router.use(pedido);
router.use(denuncia);
router.use('/admin', isAdmin, admin);
router.use('/notificacoes', isAuth, notificacao);
router.use('/painel', isAuth, painel);
router.use('/chat', isAuth, chat)

module.exports = router;