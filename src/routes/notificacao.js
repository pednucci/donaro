const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;

    const [notificacao] = await conn.query(`SELECT * FROM notificacao
    INNER JOIN solicitacao ON cd_solicitacao_notificacao = cd_solicitacao 
    INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN
    usuario ON cd_usuario_solicitacao = cd_usuario INNER JOIN
    chat ON cd_usuario = cd_userSoli_chat WHERE 
    cd_usuario_notificacao = ? ORDER BY dt_createdAt_notificacao DESC`, [idUser]);

    const [avisos] = await conn.query(`SELECT * FROM notificacao 
    WHERE cd_usuario_notificacao = ? AND cd_solicitacao_notificacao IS NULL
    ORDER BY dt_createdAt_notificacao DESC`,[idUser]);

    res.render('notificacao/notificacao', {
        notificacao,
        avisos
    })

    await conn.end();
})

module.exports = router;