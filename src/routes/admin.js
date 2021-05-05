const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/pedidos', async (req, res) => {
    const conn = await db.connection();
    const [pedidos] = await conn.query('SELECT * FROM pedido WHERE cd_avaliacao_admin_pedido = 0');
    res.render('adm/requisicoes', {
        pedidos: pedidos
    })
    await conn.end();
})

router.get('/pedidos/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await db.connection();
    const [pedido] = await conn.query('SELECT * FROM pedido WHERE cd_pedido = ?',[id]);
    const [alimento] = await conn.query('SELECT * FROM alimento WHERE cd_pedido_alimento = ?', [id])
    res.render('adm/requisicao', {
        pedido: pedido,
        alimento: alimento
    })
    await conn.end();
})

module.exports = router;