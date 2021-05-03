const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const auth = require('./routes/auth');
const pedido = require('./routes/pedido')

router.get('/', (req, res) => {
    res.render('landing-page/index')
})

router.use(auth);
router.use(pedido);

module.exports = router;