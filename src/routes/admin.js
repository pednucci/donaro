const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/pedidos', async (req, res) => {
    const conn = await db.connection();
    const [pedidos] = await conn.query(`SELECT * FROM pedido WHERE cd_situacao_pedido = 'PENDENTE'`);
    res.render('adm/requisicoes', {
        pedidos: pedidos
    })
    await conn.end();
})

router.get('/pedidos/:id', async (req, res) => {
    const conn = await db.connection();
    const id = req.params.id;

    const [acceptOrNot] = await conn.query(`SELECT cd_avaliacao_admin_pedido FROM pedido
    WHERE cd_pedido = ?`, [id]);

    if(acceptOrNot[0].cd_avaliacao_admin_pedido == 1 || 0){
        req.flash("errorMsg", "O pedido já foi avaliado!");
        res.redirect('/admin/pedidos');
        return
    }

    const [pedido] = await conn.query('SELECT * FROM pedido WHERE cd_pedido = ?',[id]);
    const [alimento] = await conn.query('SELECT * FROM alimento WHERE cd_pedido_alimento = ?', [id]);
    const [usuario] = await conn.query(`SELECT * FROM usuario WHERE cd_usuario =
    (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = ?)
    `,[id])
    res.render('adm/requisicao', {
        pedido: pedido,
        alimento: alimento,
        usuario: usuario
    })
    await conn.end();
})

router.post('/accept', async (req, res) => {
    const idPed = req.body.idPedido;
    const conn = await db.connection();
    await conn.query(`UPDATE pedido SET cd_avaliacao_admin_pedido = 1,
    cd_situacao_pedido = 'ACEITO' WHERE cd_pedido = ?`,[idPed]);
    req.flash('successMsg', 'Pedido aprovado!');
    res.redirect('/admin/pedidos');
    await conn.end();
})

router.post('/recused', async (req, res) => {
    const idPed = req.body.idPedido;
    const conn = await db.connection();
    await conn.query(`UPDATE pedido SET cd_avaliacao_admin_pedido = 0,
    cd_situacao_pedido = 'RECUSADO' WHERE cd_pedido = ?`, [idPed]);
    req.flash('successMsg', 'Pedido recusado');
    res.redirect('/admin/pedidos');
    await conn.end();
})

module.exports = router;