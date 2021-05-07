const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/pedidos', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const [pedidos] = await conn.query(`SELECT * FROM pedido WHERE cd_usuario_pedido = ?`,[idUser]);
    res.render('painel/meus-pedidos', {
        pedido: pedidos
    })
    await conn.end();
})

module.exports = router;