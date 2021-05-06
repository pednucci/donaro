const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const { isAuth } = require('../helpers/isAuth');
const db = require('../database/database');

router.get('/criar', isAuth, (req, res) => {
    res.render('pedidos/cadastrar-pedido')
})

router.get('/descobrir', async (req, res) => {
    const conn = await db.connection();
    const [pedidos] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario;`);
    for(let i = 0; i<pedidos.length; i++){
        let alPedido = [];
        const id = pedidos[i].cd_pedido;
        const [alimentos] = await conn.query(`SELECT nm_alimento FROM alimento
        WHERE cd_pedido_alimento = ?`, [id]);
        alimentos.forEach(alimento => {
            alPedido.push(alimento.nm_alimento);
        })
        pedidos[i].comida = alPedido;
    }

    res.render('pedidos/descobrir', {
        pedido: pedidos
    })

    await conn.end();
})

router.get('/descobrir/pedido/:id', async (req, res) => {
    const conn = await db.connection();
    const idPed = req.params.id;

    const [pedido] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE cd_pedido = ?`,[idPed]);

    const [alimento] = await conn.query(`SELECT * FROM alimento INNER JOIN pedido ON
     cd_pedido_alimento = cd_pedido WHERE cd_pedido_alimento = ?`, [idPed]);

    res.render('pedidos/pedido', {
        pedido: pedido,
        alimento: alimento
    })

    await conn.end();
})

router.get('/descobrir/pedido/:id/ajudar', isAuth, async (req, res) => {
    const conn = await db.connection();
    const idPed = req.params.id;
    const [alimento] = await conn.query(`SELECT * FROM alimento INNER JOIN pedido ON
     cd_pedido_alimento = cd_pedido WHERE cd_pedido_alimento = ?`, [idPed]);

    res.render('pedidos/contribuir', {
        alimento: alimento
    })
    await conn.end();
})

router.post('/ajudar', async (req, res) => {
    const conn = await db.connection();
    const idPedido = req.body.idPedido;


    const comentario = req.body.descricao;

    try{
        const idUser = req.user[0].cd_usuario;
        console.log(idUser)

        const solicitacao = await conn.query(`INSERT INTO solicitacao(cd_pedido_solicitacao,
        ds_comentario_solicitacao, cd_usuario_solicitacao) VALUES(?,?,?)`,[idPedido[0], comentario, idUser]);

        const idSoli = solicitacao[0].insertId;

        if(typeof req.body.qtd == 'object'){
            for(let i = 0; i<req.body.qtd.length; i++) {
                await conn.query(`INSERT INTO donation
                (nm_alimento_donation, qt_contribuicao_donation, cd_solicitacao_donation,
                cd_pedido_donation)
                VALUES(?,?,?,?)`
                , [req.body.nmAlimento[i], req.body.qtd[i], idSoli,
                idPedido[0]])
            }
        }
        if(typeof req.body.qtd == 'string'){
            await conn.query(`INSERT INTO donation
                (nm_alimento_donation, qt_contribuicao_donation, cd_solicitacao_donation,
                cd_pedido_donation)
                VALUES(?,?,?,?)`
                , [req.body.nmAlimento, req.body.qtd, idSoli,
                idPedido[0]])
        }
        req.flash('successMsg', 'Solicitação enviada com sucesso, espere a resposta do donatário!');
        res.redirect('/')
    }
    catch(err){
        console.log(err)
        req.flash('errorMsg', 'Erro inesperado ao enviar ajuda!');
        res.redirect('/')
    }
})

router.post('/cadpedido', newOrderController.newOrder);

module.exports = router


