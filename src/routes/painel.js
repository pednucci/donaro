const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { format } = require('date-fns')

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
         cd_pedido_solicitacao = ? ORDER BY dt_createdAt_solicitacao DESC`, [idUser, idPedido])
           
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
    
        if(situacao[0].cd_situacao_solicitacao == 'ENTREGUE' || situacao[0].cd_situacao_solicitacao == 'NÃO ENTREGUE'){
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

router.get('/relatorio/:id', async (req, res) => {
    const conn = await db.connection();
    const id = req.params.id;
    const [auth] = await conn.query(`SELECT count(*) AS count FROM pedido WHERE cd_pedido = ? AND
    cd_usuario_pedido = ?`, [id, req.user[0].cd_usuario]);
    const [expirado] = await conn.query(`SELECT count(*) AS count FROM pedido WHERE 
    cd_pedido = ? AND cd_expirado_pedido = 1`,[id]);
    const [campanha] = await conn.query(`SELECT * FROM pedido WHERE cd_pedido = ?`,[id]);
    if(auth[0].count == 1){
        if(expirado[0].count == 1){
            const [alimentos] = await conn.query(`SELECT * FROM alimento WHERE cd_pedido_alimento = ?`
            ,[id]);
            const [grafico] = await conn.query(`SELECT * FROM alimento INNER JOIN 
            pedido ON cd_pedido_alimento = cd_pedido WHERE cd_pedido = ?`,[id]);
            const [doadores] = await conn.query(`SELECT * FROM usuario INNER JOIN 
            solicitacao ON cd_usuario = cd_usuario_solicitacao WHERE cd_pedido_solicitacao = ?`,[id])
    
            res.render('painel/meus-pedidos-relatorio',{
                alimentos,
                campanha,
                grafico,
                doadores
            })
        }
        else{
            let notexpirado = {
                notexpirado: true
            }
            res.render('painel/meus-pedidos-relatorio',{
                notexpirado,
                campanha
            })
        }
    }
    else{
        res.redirect('/')
    }
    await conn.end();
})

router.post('/ressoli', async (req, res) => {
    const conn = await db.connection();
    const soli = req.body.soli;
    const [validation] = await conn.query(`SELECT count(*) AS count 
    FROM solicitacao WHERE cd_solicitacao = ?
    AND cd_situacao_solicitacao = 'A CONFIRMAR'`,[soli])
    if(validation[0].count == 1){
        if(req.body.bt == 'true'){
            try{
                var cont = 0;
                var itemsCount = 0;
    
                const [idPed] = await conn.query(`SELECT cd_pedido_solicitacao FROM solicitacao
                WHERE cd_solicitacao = ?`, [soli]);
                
                const [donations] = await conn.query(`SELECT * FROM donation WHERE cd_solicitacao_donation
                = ?`, [soli])
                
                donations.forEach(async donation => {
                    const [alimento] = await conn.query(`SELECT * FROM alimento WHERE cd_pedido_alimento = ?
                    AND nm_alimento = ?`
                    , [idPed[0].cd_pedido_solicitacao, donation.nm_alimento_donation]);
                    if (alimento[0].qt_doada_alimento < alimento[0].qt_alimento) {
                        if (donation.qt_contribuicao_donation >= alimento[0].qt_alimento) {
                            cont += alimento[0].qt_alimento
                        }
                        else {
                            cont += donation.qt_contribuicao_donation;
                        }
                    }
                    itemsCount++;
                    if(itemsCount == donations.length){
                        await conn.query(`UPDATE pedido SET qt_doacoes_pedido = qt_doacoes_pedido +
                        ${cont} WHERE cd_pedido = (SELECT cd_pedido_solicitacao FROM solicitacao WHERE 
                        cd_solicitacao = ?)`, [soli])
                    }
                })
    
                await conn.query(`UPDATE solicitacao SET cd_situacao_solicitacao = 'ENTREGUE',
                dt_deliveredAt_solicitacao = CURDATE() WHERE
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
        
                /*await conn.query(`UPDATE pedido SET qt_doacoes_pedido = qt_doacoes_pedido +
                (SELECT SUM(qt_contribuicao_donation) FROM donation WHERE cd_solicitacao_donation = ?)
                WHERE cd_pedido = (SELECT cd_pedido_solicitacao FROM solicitacao WHERE 
                cd_solicitacao = ?)`,
                [soli, soli])*/
                
                req.flash('successMsg', 'Pedido confirmado com sucesso!')
                res.redirect(`/painel/pedidos/${idPed[0].cd_pedido_solicitacao}`)
            }
            catch(err){
                console.log(err)
                req.flash('errorMsg', 'Erro inesperado')
                res.redirect('/')
            }
            
            await conn.end();
        }
        else if(req.body.bt == 'false'){
            const [idPedido] = await conn.query(`SELECT cd_pedido_solicitacao AS pedido
            FROM solicitacao WHERE cd_solicitacao = ?`, [soli])
            res.redirect(`pedidos/${idPedido[0].pedido}/${soli}/naoentregue`)
        }
    }
    else{
        req.flash('errorMsg', 'Erro inesperado');
        res.redirect('/')
    }
    
})

router.get('/doacoes', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const [quant] = await conn.query(`SELECT count(*) AS count FROM solicitacao WHERE
    cd_situacao_solicitacao = 'ENTREGUE' AND cd_usuario_solicitacao = ?`, [idUser])
    const [doacoes] = await conn.query(`SELECT * FROM solicitacao INNER JOIN
    pedido ON cd_pedido_solicitacao = cd_pedido
    WHERE cd_usuario_solicitacao = ? AND cd_situacao_solicitacao = 'ENTREGUE'`, [idUser])
    res.render('painel/minhas-doacoes', {
        doacoes,
        quant
    })
})

module.exports = router;