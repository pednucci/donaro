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

    const [isAUser] = await conn.query(`SELECT count(*) AS count FROM
    pedido WHERE cd_usuario_pedido = ? AND cd_pedido = ?`, [idUser, idPedido]);

    if(isAUser[0].count == 1){
        const [pedido] = await conn.query(`SELECT * FROM pedido WHERE cd_usuario_pedido = ? AND
        cd_pedido = ?`, [idUser, idPedido])
    
        const [notificacao] = await conn.query(`SELECT * FROM solicitacao
        INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
         cd_usuario_solicitacao = cd_usuario WHERE 
         cd_usuario_pedido = ? AND
         cd_pedido_solicitacao = ?`, [idUser, idPedido])
           
        res.render('painel/meus-pedidos-ajudas', {
            notificacao,
            pedido
        })
    }
    else{
        res.redirect('/')
    }

    await conn.end();
})

router.get('/pedidos/:id/:solicitacao', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const idPedido = req.params.id;
    const soli = req.params.solicitacao;
    let entregueOrNot = 1;

    const [isAUser] = await conn.query(`SELECT count(*) AS count FROM
    pedido WHERE cd_usuario_pedido = ? AND cd_pedido = ?`, [idUser, idPedido]);

    if(isAUser[0].count == 1){
        const [solicitacao] = await conn.query(`SELECT * FROM solicitacao
        INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
         cd_usuario_solicitacao = cd_usuario WHERE 
         cd_usuario_pedido = ? AND
         cd_pedido_solicitacao = ? AND cd_solicitacao = ?`, [idUser, idPedido, soli])
    
        const [alimento] = await conn.query(`SELECT * FROM donation INNER JOIN produto ON
        nm_alimento_donation = nm_produto INNER JOIN pedido ON cd_pedido_donation = cd_pedido
        WHERE cd_solicitacao_donation = ? AND cd_usuario_pedido = ?`
        ,[soli, idUser])
    
        const [situacao] = await conn.query(`SELECT cd_situacao_solicitacao FROM solicitacao
        WHERE cd_solicitacao = ?`,[soli])
    
        if(situacao[0].cd_situacao_solicitacao == 'ENTREGUE'){
            entregueOrNot = null;
        }
    
        res.render('painel/meus-pedidos-ajuda', {
            solicitacao,
            alimento,
            entregueOrNot
        })
    }
    else{
        res.redirect('/')
    }

    await conn.end();
})

router.post('/ressoli', async (req, res) => {
    const conn = await db.connection();
    const soli = req.body.soli;
    if(req.body.bt == 'true'){
        try{
            await conn.query(`UPDATE solicitacao SET cd_situacao_solicitacao = 'ENTREGUE' WHERE
            cd_solicitacao = ?`, [soli])
    
            const [alimentosDonation] = await conn.query(`SELECT * FROM donation 
            WHERE cd_solicitacao_donation = ?`,
            [soli]);
            
            const [alimentosPedido] = await conn.query(`SELECT * FROM alimento WHERE cd_pedido_alimento
            = (SELECT cd_pedido_solicitacao FROM solicitacao WHERE cd_solicitacao = ?)`, [soli])
    
            alimentosDonation.forEach(async alimento => {
                await conn.query(`UPDATE alimento SET
                qt_doada_alimento = qt_doada_alimento + ${alimento.qt_contribuicao_donation} 
                WHERE nm_alimento = ?
                AND cd_pedido_alimento = (SELECT cd_pedido_solicitacao
                FROM solicitacao WHERE cd_solicitacao = ?)`, [alimento.nm_alimento_donation, soli])
            })
    
            await conn.query(`UPDATE pedido SET qt_doacoes_pedido = qt_doacoes_pedido +
            (SELECT SUM(qt_contribuicao_donation) FROM donation WHERE cd_solicitacao_donation = ?)
            WHERE cd_pedido = (SELECT cd_pedido_solicitacao FROM solicitacao WHERE 
            cd_solicitacao = ?)`,
            [soli, soli])
    
            req.flash('successMsg', 'Pedido confirmado com sucesso!')
            res.redirect('/')
        }
        catch{
            req.flash('errorMsg', 'Erro inesperado')
            res.redirect('/')
        }
        
        await conn.end();
    }
})

module.exports = router;