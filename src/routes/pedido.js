const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const { isAuth } = require('../helpers/isAuth');
const db = require('../database/database');
const { isPast, formatDistanceStrict, format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

router.get('/criar', isAuth, async (req, res) => {
    const conn = await db.connection();
    const [produtos] = await conn.query('SELECT * FROM produto')
    res.render('pedidos/cadastrar-pedido', {
        produtos
    })
    await conn.end();
})

router.get('/descobrir', async (req, res) => {
    const conn = await db.connection();
    const [pedidos] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE cd_expirado_pedido = 0 ORDER BY dt_createdAt_pedido DESC
    LIMIT 0,6`)
    const [count] = await conn.query(`SELECT count(*) AS count FROM pedido`);
    let pags = count[0].count/6;;
    
    if(pags%1 != 0){
        split = (pags.toString()).split('.');
        pags = parseInt(split[0]) + 1;
    }
    const pagsEach = [];
    for(c = 1; c<=pags; c++){
        pagsEach[c-1] = c;
    }
    
    await pedidos.forEach(async pedido => {
        if (isPast(pedido.dt_encerramento_pedido)) {
            await conn.query('UPDATE pedido SET cd_expirado_pedido = 1 WHERE cd_pedido = ?'
                , [pedido.cd_pedido]);
        }
    })

    for(let i = 0; i<pedidos.length; i++){
        const id = pedidos[i].cd_pedido;
        let datPedido = [];
        const [data] = await conn.query(`SELECT dt_encerramento_pedido FROM pedido
        WHERE cd_pedido = ?`,[id]);
        data.forEach(data => {
            datPedido.push(formatDistanceStrict(Date.now(), data.dt_encerramento_pedido, {locale: ptBR}));
        })
        let alPedido = [];
        const [alimentos] = await conn.query(`SELECT nm_alimento FROM alimento
        WHERE cd_pedido_alimento = ?`, [id]);
        alimentos.forEach(alimento => {
            alPedido.push(alimento.nm_alimento);
        })
        pedidos[i].comida = alPedido;
        pedidos[i].dateRemaining = datPedido
    }

    res.render('pedidos/descobrir', {
        pedido: pedidos,
        pagsEach
    })

    await conn.end();
})

router.get('/descobrir/pag/:num', async (req, res) => {
    const num = req.params.num;
    const conn = await db.connection();
    const [pedidos] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE cd_expirado_pedido = 0 ORDER BY dt_createdAt_pedido DESC
    LIMIT ${(num*6)-6},6`)
    const [count] = await conn.query(`SELECT count(*) AS count FROM pedido`);
    let pags = count[0].count/6;;
    
    if(pags%1 != 0){
        split = (pags.toString()).split('.');
        pags = parseInt(split[0]) + 1;
    }
    const pagsEach = [];
    for(c = 1; c<=pags; c++){
        pagsEach[c-1] = c;
    }
    
    await pedidos.forEach(async pedido => {
        if (isPast(pedido.dt_encerramento_pedido)) {
            await conn.query('UPDATE pedido SET cd_expirado_pedido = 1 WHERE cd_pedido = ?'
                , [pedido.cd_pedido]);
        }
    })

    for(let i = 0; i<pedidos.length; i++){
        const id = pedidos[i].cd_pedido;
        let datPedido = [];
        const [data] = await conn.query(`SELECT dt_encerramento_pedido FROM pedido
        WHERE cd_pedido = ?`,[id]);
        data.forEach(data => {
            datPedido.push(formatDistanceStrict(Date.now(), data.dt_encerramento_pedido, {locale: ptBR}));
        })
        let alPedido = [];
        const [alimentos] = await conn.query(`SELECT nm_alimento FROM alimento
        WHERE cd_pedido_alimento = ?`, [id]);
        alimentos.forEach(alimento => {
            alPedido.push(alimento.nm_alimento);
        })
        pedidos[i].comida = alPedido;
        pedidos[i].dateRemaining = datPedido
    }

    res.render('pedidos/descobrir', {
        pedido: pedidos,
        pagsEach
    })

    await conn.end();
})

router.get('/descobrir/filter', async (req, res) => {
    const conn = await db.connection();
    const [pedidos] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE cd_expirado_pedido = 0 AND sg_estado_pedido = ? AND
    nm_cidade_pedido = ?`, [req.query.estado, req.query.cidade]);

    for(let i = 0; i<pedidos.length; i++){
        const id = pedidos[i].cd_pedido;
        let datPedido = [];
        const [data] = await conn.query(`SELECT dt_encerramento_pedido FROM pedido
        WHERE cd_pedido = ?`,[id]);
        data.forEach(data => {
            datPedido.push(formatDistanceStrict(Date.now(), data.dt_encerramento_pedido, {locale: ptBR}));
        })
        let alPedido = [];
        const [alimentos] = await conn.query(`SELECT nm_alimento FROM alimento
        WHERE cd_pedido_alimento = ?`, [id]);
        alimentos.forEach(alimento => {
            alPedido.push(alimento.nm_alimento);
        })
        pedidos[i].comida = alPedido;
        pedidos[i].dateRemaining = datPedido
    }

    const titulo = `${req.query.estado} - ${req.query.cidade}`

    res.render('pedidos/descobrir', {
        pedido: pedidos,
        titulo
    })

    await conn.end();
})

router.get('/descobrir/pedido/:id', async (req, res) => {
    const conn = await db.connection();
    const idPed = req.params.id;

    const [pedido] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE cd_pedido = ?`,[idPed]);

    const id = pedido[0].cd_pedido;
    let datPedido = [];
    const [data] = await conn.query(`SELECT dt_encerramento_pedido FROM pedido
    WHERE cd_pedido = ?`,[id]);
    data.forEach(data => {
        datPedido.push(formatDistanceStrict(Date.now(), data.dt_encerramento_pedido, {locale: ptBR}));
    })
    pedido[0].dateRemaining = datPedido

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

        const solicitacao = await conn.query(`INSERT INTO solicitacao(cd_pedido_solicitacao,
        ds_comentario_solicitacao, cd_usuario_solicitacao) VALUES(?,?,?)`,[idPedido[0], comentario, idUser]);

        const idSoli = solicitacao[0].insertId;

        if(typeof req.body.qtd == 'object'){
            for(let i = 0; i<req.body.qtd.length; i++) {
                if(req.body.nmAlimento[i] == '' || req.body.qtd[i] == '') continue;
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
    await conn.end();
})

router.post('/criar', newOrderController.newOrder);

module.exports = router


