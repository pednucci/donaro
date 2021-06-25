const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const { isAuth } = require('../helpers/isAuth');
const db = require('../database/database');
const { isPast, formatDistanceStrict, format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const path = require('path');

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
    cd_usuario_pedido = cd_usuario WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() 
    AND cd_deletado_pedido IS NULL
    ORDER BY dt_createdAt_pedido DESC
    LIMIT 0,6`)
    const [count] = await conn.query(`SELECT count(*) AS count FROM pedido 
    WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() AND cd_deletado_pedido IS NULL`);
    let pags = count[0].count/6;;
    
    if(pags%1 != 0){
        split = (pags.toString()).split('.');
        pags = parseInt(split[0]) + 1;
    }
    const pagsEach = [];
    for(c = 1; c<=pags; c++){
        pagsEach[c-1] = c;
    }

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
    cd_usuario_pedido = cd_usuario WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP()
    AND cd_deletado_pedido IS NULL
    ORDER BY dt_createdAt_pedido DESC
    LIMIT ${(num*6)-6},6`)
    const [count] = await conn.query(`SELECT count(*) AS count FROM pedido 
    WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() AND cd_deletado_pedido IS NULL`);
    let pags = count[0].count/6;
    
    if(pags%1 != 0){
        split = (pags.toString()).split('.');
        pags = parseInt(split[0]) + 1;
    }
    const pagsEach = [];
    for(c = 1; c<=pags; c++){
        pagsEach[c-1] = c;
    }

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
    cd_usuario_pedido = cd_usuario WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() 
    AND sg_estado_pedido = ? AND nm_cidade_pedido = ? LIMIT 0,6`, [req.query.estado, req.query.cidade]);
    const [count] = await conn.query(`SELECT count(*) AS count FROM pedido
    WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() AND cd_deletado_pedido IS NULL
    AND sg_estado_pedido = ? AND nm_cidade_pedido = ?`, [req.query.estado, req.query.cidade]);
    let pags = count[0].count/6;
    
    if(pags%1 != 0){
        split = (pags.toString()).split('.');
        pags = parseInt(split[0]) + 1;
    }
    const pagsFilter = [];
    for(c = 1; c<=pags; c++){
        pagsFilter[c-1] = {
            pag: c,
            estado: req.query.estado,
            cidade: req.query.cidade,
            state: req.query.state
        } 
    }

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
        titulo,
        pagsFilter
    })

    await conn.end();
})

router.get('/descobrir/filter/:num', async (req, res) => {
    const num = req.params.num;
    const conn = await db.connection();
    const [pedidos] = await conn.query(`SELECT * FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() 
    AND sg_estado_pedido = ? AND nm_cidade_pedido = ? ORDER BY dt_createdAt_pedido DESC
    LIMIT ${(num*6)-6},6`, [req.query.estado, req.query.cidade]);
    const [count] = await conn.query(`SELECT count(*) AS count FROM pedido
    WHERE dt_encerramento_pedido > CURRENT_TIMESTAMP() AND sg_estado_pedido = ? 
    AND nm_cidade_pedido = ?`, [req.query.estado, req.query.cidade]);
    let pags = count[0].count/6;

    if(pags%1 != 0){
        split = (pags.toString()).split('.');
        pags = parseInt(split[0]) + 1;
    }
    const pagsFilter = [];
    for(c = 1; c<=pags; c++){
        pagsFilter[c-1] = {
            pag: c,
            estado: req.query.estado,
            cidade: req.query.cidade,
            state: req.query.state
        } 
    }

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
        titulo,
        pagsFilter
    })

    await conn.end();
})

router.get('/descobrir/pedido/:id', async (req, res) => {
    const conn = await db.connection();
    const idPed = req.params.id;

    const [pedido] = await conn.query(`SELECT *, count(*) AS count FROM pedido INNER JOIN usuario ON
    cd_usuario_pedido = cd_usuario WHERE cd_pedido = ? 
    AND dt_encerramento_pedido > CURRENT_TIMESTAMP()`,[idPed]);

    if(pedido.length == 0){
        res.redirect('/')
    }
    else{
        if(pedido[0].cd_deletado_pedido == 1 || pedido[0].count == 0){
            res.redirect('/')
        }
        else{
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
            
            if(req.user){
        
                const [count] = await conn.query(`SELECT count(*) AS count FROM pedido
                WHERE cd_pedido = ? AND cd_usuario_pedido = ?`,[idPed, req.user[0].cd_usuario]);
            
                if(count[0].count == 1){
                    let identify = {
                        exist: true
                    }
                    res.render('pedidos/pedido', {
                        pedido: pedido,
                        alimento: alimento,
                        identify
                    })
                }
                else{
                    res.render('pedidos/pedido', {
                        pedido: pedido,
                        alimento: alimento
                    })
                }
             }
            else{
                res.render('pedidos/pedido', {
                    pedido: pedido,
                    alimento: alimento
                })
            }
        }
    }      
    await conn.end();
})

router.post('/descobrir/pedido/:id', async (req, res) => {
    const conn = await db.connection();
    const idPedido = req.params.id;

    const comentario = req.body.descricao;

    try{
        const idUser = req.user[0].cd_usuario;
        var erros = []

        if(typeof req.body.qtd == 'object'){
            let qtd = [];
            let count = 0;
            for(let i = 0; i<req.body.qtd.length; i++) {
                qtd[i] = req.body.qtd[i];
            }
            qtd.forEach(q => {
                if(!q) count++;
            })
            if(count == req.body.qtd.length){
                erros.push({text: 'Pelo menos um alimento preciso ser preenchido'})
            }
        }
        if(typeof req.body.qtd == 'string' && !req.body.qtd[0]){
            erros.push({text: 'Pelo menos um alimento preciso ser preenchido'})
        }

        if(erros.length > 0){
            const [alimento] = await conn.query(`SELECT * FROM alimento INNER JOIN pedido ON
            cd_pedido_alimento = cd_pedido WHERE cd_pedido_alimento = ?`, [idPedido]);
            const [pedido] = await conn.query(`SELECT *, count(*) AS count FROM 
            pedido INNER JOIN usuario ON cd_usuario_pedido = cd_usuario WHERE cd_pedido = ? 
            AND dt_encerramento_pedido > CURRENT_TIMESTAMP()`,[idPedido]); 
            
            res.render('pedidos/pedido', {
                alimento,
                pedido,
                erros
            })
        }
        else{
            const solicitacao = await conn.query(`INSERT INTO solicitacao(cd_pedido_solicitacao,
            ds_comentario_solicitacao, cd_usuario_solicitacao) VALUES(?,?,?)`,[idPedido, comentario, idUser]);
            const idSoli = solicitacao[0].insertId;
            
            if(typeof req.body.qtd == 'object'){
                let qtd = []
                let count = 0;
                for(d = 0; d<req.body.qtd.length; d++) {
                    qtd[d] = req.body.qtd[d];
                }
                qtd.forEach(q => {
                    if(q) count++
                })
                if(count != qtd.length){
                    for(c = 0; c<qtd.length; c++) {
                        if(qtd[c]){
                            await conn.query(`INSERT INTO donation
                            (nm_alimento_donation, qt_contribuicao_donation, cd_solicitacao_donation,
                            cd_pedido_donation)
                            VALUES(?,?,?,?)`
                            , [req.body.nmAlimento[c], req.body.qtd[c], idSoli,
                            idPedido])
                        }
                    }
                }
                else{
                    for(c = 0; c<count; c++) {
                        await conn.query(`INSERT INTO donation
                        (nm_alimento_donation, qt_contribuicao_donation, cd_solicitacao_donation,
                        cd_pedido_donation)
                        VALUES(?,?,?,?)`
                        , [req.body.nmAlimento[c], req.body.qtd[c], idSoli,
                        idPedido])
                    }
                }
            }
            if(typeof req.body.qtd == 'string'){
                await conn.query(`INSERT INTO donation
                    (nm_alimento_donation, qt_contribuicao_donation, cd_solicitacao_donation,
                    cd_pedido_donation)
                    VALUES(?,?,?,?)`
                    , [req.body.nmAlimento, req.body.qtd, idSoli,
                    idPedido])
            }
            const [userPedido] = await conn.query(`SELECT cd_usuario_pedido FROM pedido WHERE
            cd_pedido = ?`, [idPedido])

            const [chatValidation] = await conn.query(`SELECT count(*) AS count FROM chat 
            WHERE cd_userSoli_chat = ? AND cd_userPedido_chat = ? AND
            cd_pedido_chat = ?`,[req.user[0].cd_usuario, userPedido[0].cd_usuario_pedido, idPedido])

            if(chatValidation[0].count < 1){
                await conn.query(`INSERT INTO chat(cd_pedido_chat, cd_solicitacao_chat, cd_userPedido_chat,
                cd_userSoli_chat) VALUES(?,?,?,?)`,[idPedido, idSoli, userPedido[0].cd_usuario_pedido,
                idUser]);
            }
            const [pedido] = await conn.query(`SELECT * FROM 
            pedido INNER JOIN usuario ON cd_usuario_pedido = cd_usuario WHERE cd_pedido = ? 
            AND dt_encerramento_pedido > CURRENT_TIMESTAMP()`,[idPedido]); 

            await conn.query(`INSERT INTO notificacao(cd_usuario_notificacao, ds_notificacao,
            cd_solicitacao_notificacao) VALUES(?,'Você registrou uma doação para a campanha
            "${pedido[0].nm_titulo_pedido}", clique para entrar no chat.',?)`,[req.user[0].cd_usuario
            ,idSoli]);

            await conn.query(`INSERT INTO notificacao(cd_usuario_notificacao, ds_notificacao,
            cd_solicitacao_notificacao) VALUES(?,'${req.user[0].nm_usuario} quer doar para a sua campanha 
            "${pedido[0].nm_titulo_pedido}", clique para ver os detalhes.',?)`,
            [pedido[0].cd_usuario_pedido ,idSoli]);
            
            req.flash('successMsg', 'Doação registrada com sucesso! Converse com o donatário pelo chat');
            res.redirect('/descobrir')
        }
    }
    catch(err){
        console.log(err)
        req.flash('errorMsg', 'Erro inesperado ao enviar ajuda!');
        res.redirect('/')
    }
    await conn.end();
})

router.post('/criar', newOrderController.newOrder);

router.get('/edit/:id', isAuth, async (req, res) => {
    const conn = await db.connection();
    const idPedido = req.params.id;
    const [pedido] = await conn.query(`SELECT * FROM pedido WHERE cd_pedido = ? AND 
    cd_usuario_pedido = ? AND cd_deletado_pedido IS NULL AND
    dt_encerramento_pedido > CURRENT_TIMESTAMP()`,[idPedido, req.user[0].cd_usuario]);
    if(pedido.length){
        res.render('pedidos/editar-pedido', {pedido})
    }
    else res.redirect('/')
    await conn.end();
})

router.post('/edit/:id', async (req, res) => {
    try{
        const conn = await db.connection();
        const idPedido = req.params.id;
        const [pedido] = await conn.query(`SELECT * FROM pedido WHERE cd_pedido = ? AND 
        cd_usuario_pedido = ?`,[idPedido, req.user[0].cd_usuario]);
        var erros = [];
        if(!req.body.titulo && !req.files && !req.body.descPed){
            erros.push({text: 'Pelo menos um campo precisa ser preenchido!'})
        }
        if(erros.length == 0){
            if(req.files){
                fileUpload = req.files.campImg;
                uploadPath = path.join(__dirname, '..', '..', '/public/assets/pedidos/' + fileUpload.name)  ;
                fileUpload.mv(uploadPath, async (err) => {
                    if(err){
                        req.flash("errorMsg", "Erro inesperado!")
                        console.log(err)
                        res.redirect('/')
                    }
                    else{
                        await conn.query(`UPDATE pedido SET cd_imagem_pedido = ? WHERE
                        cd_pedido = ?`, [fileUpload.name, idPedido])
                    }        
                })
            }
            if(req.body.titulo) await conn.query(`UPDATE pedido SET nm_titulo_pedido = ? WHERE
            cd_pedido = ?`,[req.body.titulo, idPedido]);
            if(req.body.descPed) await conn.query(`UPDATE pedido SET ds_acao_pedido = ? WHERE
            cd_pedido = ?`,[req.body.descPed, idPedido]);
            req.flash("successMsg", "Campanha editada com sucesso!");
            res.redirect(`/descobrir/pedido/${idPedido}`);
        }
        else{
            res.render('pedidos/editar-pedido', {pedido, erros})
        }
    }
    catch(err){
        console.log(err);
        req.flash("errorMsg", "Erro inesperado!");
        res.redirect('/')
    }
})

module.exports = router


