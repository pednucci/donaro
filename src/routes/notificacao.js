const express = require('express');
const router = express.Router();
const { isAuth } = require('../helpers/isAuth');
const db = require('../database/database');

router.get('/', isAuth, async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;

    const [notificacao] = await conn.query(`SELECT * FROM solicitacao
     INNER JOIN pedido ON cd_usuario_pedido = ? INNER JOIN usuario ON
      cd_usuario_solicitacao = cd_usuario WHERE cd_avaliacao_admin_pedido = 1`, [idUser])

    res.render('notificacao/notificacao-ajuda', {
        notificacao: notificacao
    })
})

module.exports = router;