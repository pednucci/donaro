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

router.get('/pedidos/:id', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const idPedido = req.params.id;

    const [pedido] = await conn.query(`SELECT * FROM pedido WHERE cd_usuario_pedido = ? AND
    cd_pedido = ?`, [idUser, idPedido])

    const [notificacao] = await conn.query(`SELECT * FROM solicitacao
    INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
     cd_usuario_solicitacao = cd_usuario WHERE 
     cd_situacao_solicitacao = 'A CONFIRMAR' AND cd_usuario_pedido = ? AND
     cd_pedido_solicitacao = ?`, [idUser, idPedido])
       
    res.render('painel/meus-pedidos-ajudas', {
        notificacao,
        pedido
    })

    await conn.end();
})

module.exports = router;