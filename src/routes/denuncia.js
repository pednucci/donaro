const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { isAuth } = require('../helpers/isAuth');

router.get('/descobrir/pedido/:id/denuncia', isAuth, (req, res) => {
    res.render('denuncias/denuncia-pedido')
})

router.post('/descobrir/pedido/:id/denuncia', async (req, res) => {
    const conn = await db.connection();
    const motivo = req.body.motivo;
    const descricao = req.body.descricao;
    const idUser = req.user[0].cd_usuario;
    const idPedido = req.params.id;
    try{
        await conn.query(`INSERT INTO denuncia(cd_usuario_denuncia, nm_motivo_denuncia,
        ds_descricao_denuncia, cd_pedido_denunciado) VALUES(?,?,?,?)`,
        [idUser, motivo, descricao, idPedido]);
        req.flash('successMsg', 'Denúncia enviada com sucesso');
        res.redirect('/descobrir')
    }
    catch(err){
        console.log(err);
        req.flash('errorMsg', 'Erro inesperado');
        res.redirect('/descobrir')
    }
    
})

router.get('/painel/pedidos/:pedido/:soli/naoentregue', isAuth, async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const [soliPedido] = await conn.query(`SELECT COUNT(*) AS count FROM solicitacao 
    WHERE cd_pedido_solicitacao = ? AND cd_solicitacao = ?`,[req.params.pedido, req.params.soli]);
    const [validation] = await conn.query(`SELECT COUNT(*) AS count FROM 
    pedido WHERE cd_pedido = ? AND cd_usuario_pedido = ?`,[req.params.pedido, idUser])
    const [soliCount] = await conn.query(`SELECT count(*) AS count FROM solicitacao WHERE
    cd_solicitacao = ?`, [req.params.soli]);
    const [solicitacao] = await conn.query(`SELECT cd_situacao_solicitacao AS situacao
    FROM solicitacao WHERE cd_solicitacao = ?`,
    [req.params.soli]);
    if(soliCount[0].count == 1 && validation[0].count == 1 && soliPedido[0].count >= 1 &&
    solicitacao[0].situacao == 'A CONFIRMAR'){
        res.render('denuncias/nao-entregue')
    }
    else{
        res.redirect('/')
    }
})

router.post('/painel/pedidos/:pedido/:soli/naoentregue', isAuth , async (req, res) => {
    const conn = await db.connection();
    const descricao = req.body.descricao;
    const idUser = req.user[0].cd_usuario;
    const [soliPedido] = await conn.query(`SELECT COUNT(*) AS count FROM solicitacao 
    WHERE cd_pedido_solicitacao = ? AND cd_solicitacao = ?`,[req.params.pedido, req.params.soli]);
    const [validation] = await conn.query(`SELECT COUNT(*) AS count FROM 
    pedido WHERE cd_pedido = ? AND cd_usuario_pedido = ?`,[req.params.pedido, idUser])
    const [soliCount] = await conn.query(`SELECT count(*) AS count FROM solicitacao WHERE
    cd_solicitacao = ?`, [req.params.soli]);
    const [solicitacao] = await conn.query(`SELECT cd_situacao_solicitacao AS situacao
    FROM solicitacao WHERE cd_solicitacao = ?`,
    [req.params.soli]);
    if(soliCount[0].count == 1 && validation[0].count == 1 && soliPedido[0].count >= 1 &&
    solicitacao[0].situacao == 'A CONFIRMAR'){
        try{
            const [usuarioDenunciado] = await conn.query(`SELECT cd_usuario_solicitacao AS user FROM solicitacao
            WHERE cd_solicitacao = ?`, [req.params.soli]);
            await conn.query(`UPDATE solicitacao SET cd_situacao_solicitacao = 
            'NÃO ENTREGUE' WHERE
            cd_solicitacao = ?`, [req.params.soli])
            await conn.query(`INSERT INTO denuncia(cd_usuario_denuncia, nm_motivo_denuncia,
            ds_descricao_denuncia, cd_usuario_denunciado) VALUES(?,'Produto não entregue', ?, ?)`,
            [idUser, descricao, usuarioDenunciado[0].user]);
            req.flash('successMsg', 'Resposta enviada');
            res.redirect(`/painel/pedidos/${req.params.pedido}`)
        }
        catch(err){
            console.log(err)
            req.flash('errorMsg', 'Erro inesperado');
            res.redirect(`/painel/pedidos/${req.params.pedido}`)
        }   
    }
    else{
        res.redirect('/')
    }
})

router.get('/chat/usuario/:id/denuncia', isAuth, async (req, res) => {
    const conn = await db.connection();
    const you = req.user[0].cd_usuario;
    const other = req.params.id;
    const [count] = await conn.query(`SELECT count(*) AS count 
    FROM chat WHERE (cd_userPedido_chat = ? AND cd_userSoli_chat = ?) OR
    (cd_userPedido_chat = ? AND cd_userSoli_chat = ?)`,[you, other, other, you])
    if(count[0].count >= 1) res.render('denuncias/denuncia-usuario')
    else res.redirect('/')
})

router.post('/chat/usuario/:id/denuncia', isAuth, async (req, res) => {
    const conn = await db.connection();
    const motivo = req.body.denuncia;
    const descricao = req.body.descricao;
    const idUser = req.user[0].cd_usuario;
    const usuarioDenunciado = req.params.id;
    try{
        await conn.query(`INSERT INTO denuncia(cd_usuario_denuncia, nm_motivo_denuncia,
        ds_descricao_denuncia, cd_usuario_denunciado) VALUES(?,?,?,?)`,
        [idUser, motivo, descricao, usuarioDenunciado]);
        req.flash('successMsg', 'Denúncia enviada com sucesso');
        res.redirect('/chat')
    }
    catch(err){
        console.log(err);
        req.flash('errorMsg', 'Erro inesperado');
        res.redirect('/chat')
    }
})

module.exports = router;