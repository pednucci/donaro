const router = require('express').Router();
const db = require('../database/database');

router.get('/', async (req, res) => {
    const conn = await db.connection();
    const idUser = req.user[0].cd_usuario;
    const [chatCampanhas] = await conn.query(`SELECT * FROM chat 
    INNER JOIN pedido ON cd_pedido_chat = cd_pedido INNER JOIN usuario
    ON cd_userSoli_chat = cd_usuario
    WHERE cd_userPedido_chat = ?`, [idUser]);
    const [chatSolicitacoes] = await conn.query(`SELECT * FROM chat
    INNER JOIN solicitacao ON cd_solicitacao_chat = cd_solicitacao INNER JOIN
    pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
    cd_userPedido_chat = cd_usuario WHERE cd_userSoli_chat = ?
    `,[idUser])

    res.render('chat/chat-inicial', {
        chatSolicitacoes,
        chatCampanhas
    })
})

router.get('/:soli', async (req, res) => {
    const conn = await db.connection();
    const idSoli = req.params.soli;
    const idUser = req.user[0].cd_usuario;
    const [count] = await conn.query(`SELECT count(*) AS count FROM solicitacao WHERE cd_solicitacao
    = ?`, idSoli);
    if(count[0].count == 1){
        const [soli] = await conn.query(`SELECT * FROM solicitacao INNER JOIN pedido ON
        cd_pedido_solicitacao = cd_pedido
        WHERE cd_solicitacao = ?`, idSoli);
        if(soli[0].cd_usuario_solicitacao == idUser){
            const [userPedido] = await conn.query(`SELECT * FROM usuario
            INNER JOIN pedido ON cd_usuario = cd_usuario_pedido WHERE cd_usuario = (SELECT
            cd_userPedido_chat FROM chat WHERE cd_solicitacao_chat = ?)`,[idSoli]);
            const [mensagem] = await conn.query(`SELECT * FROM mensagem WHERE cd_chat_mensagem
            = ?`, [idSoli]);
            const [chatCampanhas] = await conn.query(`SELECT * FROM chat 
            INNER JOIN pedido ON cd_pedido_chat = cd_pedido INNER JOIN usuario
            ON cd_userSoli_chat = cd_usuario
            WHERE cd_userPedido_chat = ?`, [idUser]);
            const [chatSolicitacoes] = await conn.query(`SELECT * FROM chat
            INNER JOIN solicitacao ON cd_solicitacao_chat = cd_solicitacao INNER JOIN
            pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
            cd_userPedido_chat = cd_usuario WHERE cd_userSoli_chat = ?
            `,[idUser])

            res.render('chat/chat', {
                userPedido,
                mensagem,
                chatCampanhas,
                chatSolicitacoes
            })
        }
        else if(soli[0].cd_usuario_pedido == idUser){
            const [userSoli] = await conn.query(`SELECT * FROM usuario
            INNER JOIN solicitacao ON cd_usuario = cd_usuario_solicitacao
            INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido WHERE cd_usuario = (SELECT
            cd_userSoli_chat FROM chat WHERE cd_solicitacao_chat = ?)`,[idSoli]);
            const [mensagem] = await conn.query(`SELECT * FROM mensagem WHERE cd_chat_mensagem
            = ?`, [idSoli]);
            const [chatCampanhas] = await conn.query(`SELECT * FROM chat 
            INNER JOIN pedido ON cd_pedido_chat = cd_pedido INNER JOIN usuario
            ON cd_userSoli_chat = cd_usuario
            WHERE cd_userPedido_chat = ?`, [idUser]);
            const [chatSolicitacoes] = await conn.query(`SELECT * FROM chat
            INNER JOIN solicitacao ON cd_solicitacao_chat = cd_solicitacao INNER JOIN
            pedido ON cd_pedido_solicitacao = cd_pedido INNER JOIN usuario ON
            cd_userPedido_chat = cd_usuario WHERE cd_userSoli_chat = ?
            `,[idUser])

            res.render('chat/chat', {
                userSoli,
                mensagem,
                chatCampanhas,
                chatSolicitacoes
            })
        }
        else{
            res.redirect('/')
        }     
    }
    else{
        res.redirect('/')
    }
    await conn.end();
})

module.exports = router;