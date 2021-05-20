const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;

    const [notificacao] = await conn.query(`SELECT * FROM solicitacao
    INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
     cd_usuario_solicitacao = cd_usuario WHERE 
     cd_situacao_solicitacao = 'A CONFIRMAR' AND cd_usuario_pedido = ?`, [idUser])

    res.render('notificacao/notificacao-ajuda', {
        notificacao: notificacao
    })

    await conn.end();
})

router.get('/one/:id', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const idSoli = req.params.id;

    const [notificacao] = await conn.query(`SELECT * FROM solicitacao  INNER JOIN usuario ON
    cd_usuario_solicitacao = cd_usuario WHERE cd_solicitacao = ?
    AND cd_situacao_solicitacao = 'A CONFIRMAR';`,
    [idSoli]);

    const [alimento] = await conn.query(`SELECT * FROM donation INNER JOIN alimento ON 
    nm_alimento_donation = nm_alimento WHERE cd_solicitacao_donation = ? AND cd_pedido_alimento = 
    (SELECT cd_pedido_solicitacao FROM solicitacao WHERE cd_solicitacao = ?);;`,[idSoli, idSoli])

    res.render('notificacao/notificacao-aceitar', {
        notificacao: notificacao,
        alimento: alimento
    })

    await conn.end();
})

router.get('/doacoes', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const [notificacao] = await conn.query(`SELECT * FROM solicitacao INNER JOIN
    pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON cd_usuario_pedido = cd_usuario
    WHERE cd_usuario_solicitacao = ?`, [idUser])
    res.render('notificacao/notificacao-doacoes', {
        notificacao: notificacao
    })

    await conn.end();
})

module.exports = router;