const express = require('express');
const router = express.Router();

router.get('/descobrir/pedido/:id/denuncia', (req, res) => {
    res.render('denuncias/denuncia-pedido')
})

module.exports = router;