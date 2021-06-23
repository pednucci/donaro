const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/denuncias/campanhas', async (req, res) => {
    const conn = await db.connection();
    const [campanhas] = await conn.query(`SELECT * FROM denuncia INNER JOIN pedido 
    ON cd_pedido_denunciado = cd_pedido WHERE cd_pedido_denunciado IS NOT NULL`);
    res.render('adm/denuncias-pedidos', {
        campanhas
    })
})

router.get('/denuncias/campanhas/:id', async (req, res) => {
    const conn = await db.connection();
    const [denuncia] = await conn.query(`SELECT * FROM denuncia INNER JOIN usuario ON
    cd_usuario_denuncia = cd_usuario INNER JOIN pedido ON cd_pedido_denunciado = cd_pedido
    WHERE cd_denuncia = ?`,[req.params.id]);
    const [denunciado] = await conn.query(`SELECT * FROM usuario WHERE cd_usuario =  
    (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = (SELECT cd_pedido_denunciado FROM 
    denuncia WHERE cd_denuncia = ?))`, [req.params.id])
    res.render('adm/denuncias-pedido', {
        denuncia,
        denunciado
    })
})

router.post('/denuncias/campanhas/:id', async (req, res) => {
    const conn = await db.connection();
    try{
        if(req.body.resp == 'adv'){
            const [usuario] = await conn.query(`SELECT * FROM usuario WHERE
            cd_usuario = (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = (SELECT 
            cd_pedido_denunciado FROM denuncia WHERE cd_denuncia = ?))`,[req.params.id])
            await conn.query(`UPDATE usuario SET qt_advertencias_usuario = qt_advertencias_usuario + 1
            WHERE cd_usuario = (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = (SELECT 
            cd_pedido_denunciado FROM denuncia WHERE cd_denuncia = ?))`,[req.params.id])
            .then(async () => {
                await conn.query(`INSERT INTO notificacao(cd_usuario_notificacao, ds_notificacao)
                VALUES(?,'Você recebeu um aviso! (${usuario[0].qt_advertencias_usuario + 1}/10) respeite 
                os termos e políticas e se atente às boas normas!')`,[usuario[0].cd_usuario]);                
            });
            if(usuario[0].qt_advertencias_usuario == 9){
                await conn.query(`UPDATE usuario SET cd_deletado_usuario =  1
                WHERE cd_usuario = (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = (SELECT 
                cd_pedido_denunciado FROM denuncia WHERE cd_denuncia = ?))`,[req.params.id]);
            }
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id])
        }
        else if(req.body.resp == 'account'){
            await conn.query(`UPDATE usuario SET cd_deletado_usuario =  1
            WHERE cd_usuario = (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = (SELECT 
            cd_pedido_denunciado FROM denuncia WHERE cd_denuncia = ?))`,[req.params.id]);
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id])
        }
        else if(req.body.resp == 'delete'){
            await conn.query(`UPDATE pedido SET cd_deletado_pedido = 1 WHERE cd_pedido =
            (SELECT cd_pedido_denunciado FROM denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id])
        }
        else if (req.body.resp == 'invalidar'){
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id]);
        }
        req.flash('successMsg', 'Resposta enviada');
        res.redirect('/admin/denuncias/campanhas')
    }
    catch(err){
        console.log(err);
        req.flash('errorMsg', 'Erro inesperado')
        res.redirect('/admin/denuncias/campanhas')
    }

})

router.get('/denuncias/naoentregues', async (req, res) => {
    const conn = await db.connection();
    const [denuncias] = await conn.query(`SELECT * FROM denuncia INNER JOIN solicitacao ON
    cd_solicitacao_denunciada = cd_solicitacao INNER JOIN usuario ON cd_usuario_solicitacao
    = cd_usuario INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido WHERE cd_usuario_denunciado
    IS NOT NULL AND nm_motivo_denuncia = 'Produto não entregue' AND cd_solicitacao_denunciada
    IS NOT NULL`)
    res.render('adm/pedidos-nao-entregues', {
        denuncias
    })
})

router.get('/denuncias/naoentregues/:id', async (req, res) => {
    const conn = await db.connection();
    const [denuncia] = await conn.query(`SELECT * FROM denuncia INNER JOIN solicitacao ON
    cd_solicitacao_denunciada = cd_solicitacao INNER JOIN usuario ON cd_usuario_solicitacao
    = cd_usuario INNER JOIN pedido ON cd_pedido_solicitacao = cd_pedido WHERE cd_denuncia = ?`,
    [req.params.id]);
    const [donoDenuncia] = await conn.query(`SELECT * FROM usuario WHERE cd_usuario = 
    (SELECT cd_usuario_pedido FROM pedido WHERE cd_pedido = (SELECT cd_pedido_solicitacao FROM
    solicitacao WHERE cd_solicitacao = ?))`,[denuncia[0].cd_solicitacao_denunciada])
    const [alimentos] = await conn.query(`SELECT * FROM alimento WHERE cd_pedido_alimento = 
    (SELECT cd_pedido_solicitacao FROM solicitacao WHERE cd_solicitacao = ?)`,
    [denuncia[0].cd_solicitacao_denunciada])
    res.render('adm/pedido-nao-entregue', {
        denuncia,
        donoDenuncia,
        alimentos
    })
})

router.post('/denuncias/naoentregues/:id', async (req, res) => {
    const conn = await db.connection();
    try{
        if(req.body.resp == 'adv'){
            const [usuario] = await conn.query(`SELECT * FROM usuario WHERE
            cd_usuario = (SELECT cd_usuario_denunciado FROM 
            denuncia WHERE cd_denuncia = ?)`,[req.params.id])
            await conn.query(`UPDATE usuario SET qt_advertencias_usuario = qt_advertencias_usuario + 1
            WHERE cd_usuario = (SELECT cd_usuario_denunciado FROM 
            denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            await conn.query(`INSERT INTO notificacao(cd_usuario_notificacao, ds_notificacao)
            VALUES(?,'Você recebeu um aviso! (${usuario[0].qt_advertencias_usuario + 1}/10) respeite 
            os termos e políticas e se atente às boas normas!')`,[usuario[0].cd_usuario]);
            if(usuario[0].qt_advertencias_usuario == 9){
                await conn.query(`UPDATE usuario SET cd_deletado_usuario =  1
                WHERE cd_usuario = (SELECT cd_usuario_denunciado FROM 
                denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            }
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id])
        }
        else if(req.body.resp == 'account'){
            await conn.query(`UPDATE usuario SET cd_deletado_usuario =  1
            WHERE cd_usuario = (SELECT cd_usuario_denunciado FROM 
            denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id])
        }
        else if (req.body.resp == 'invalidar'){
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id]);
        }
        req.flash('successMsg', 'Resposta enviada');
        res.redirect('/admin/denuncias/naoentregues')
    }
    catch(err){
        console.log(err);
        req.flash('errorMsg', 'Erro inesperado');
        res.redirect('/admin/denuncias/naoentregues')
    }
})

router.get('/denuncias/usuarios', async (req, res) => {
    const conn = await db.connection();
    const [denuncias] = await conn.query(`SELECT * FROM denuncia INNER JOIN usuario ON
    cd_usuario_denunciado = cd_usuario WHERE cd_usuario_denunciado
    IS NOT NULL AND nm_motivo_denuncia != 'Produto não entregue'`)
    res.render('adm/denuncias-usuarios', {
        denuncias
    })
})

router.get('/denuncias/usuarios/:id', async (req, res) => {
    const conn = await db.connection();
    const [denuncia] = await conn.query(`SELECT * FROM denuncia INNER JOIN usuario ON
    cd_usuario_denunciado = cd_usuario WHERE cd_usuario_denunciado
    IS NOT NULL AND nm_motivo_denuncia != 'Produto não entregue' AND cd_denuncia = ?`,
    [req.params.id]);
    const [donoDenuncia] = await conn.query(`SELECT * FROM usuario WHERE cd_usuario = 
    (SELECT cd_usuario_denuncia FROM denuncia WHERE cd_denuncia = ?)`,[req.params.id])
    res.render('adm/denuncias-usuario',{
        denuncia,
        donoDenuncia
    })
})

router.post('/denuncias/usuarios/:id', async (req, res) => {
    const conn = await db.connection();
    try{
        if(req.body.resp == 'adv'){
            const [usuario] = await conn.query(`SELECT * FROM usuario WHERE
            cd_usuario = (SELECT cd_usuario_denunciado FROM 
            denuncia WHERE cd_denuncia = ?)`,[req.params.id])
            await conn.query(`UPDATE usuario SET qt_advertencias_usuario = qt_advertencias_usuario + 1
            WHERE cd_usuario = (SELECT cd_usuario_denunciado FROM 
            denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            await conn.query(`INSERT INTO notificacao(cd_usuario_notificacao, ds_notificacao)
            VALUES(?,'Você recebeu um aviso! (${usuario[0].qt_advertencias_usuario + 1}/10) respeite 
            os termos e políticas e se atente às boas normas!')`,[usuario[0].cd_usuario]);
            if(usuario[0].qt_advertencias_usuario == 9){
                await conn.query(`UPDATE usuario SET cd_deletado_usuario =  1
                WHERE cd_usuario = (SELECT cd_usuario_denunciado FROM 
                denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            }
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id]);
        }
        else if(req.body.resp == 'account'){
            await conn.query(`UPDATE usuario SET cd_deletado_usuario =  1
            WHERE cd_usuario = (SELECT cd_usuario_denunciado FROM 
            denuncia WHERE cd_denuncia = ?)`,[req.params.id]);
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id])
        }
        else if (req.body.resp == 'invalidar'){
            await conn.query(`UPDATE denuncia SET nm_situacao_denuncia = 'Resolvida' WHERE
            cd_denuncia = ?`,[req.params.id]);
        }
        req.flash('successMsg', 'Resposta enviada');
        res.redirect('/admin/denuncias/usuarios')
    }
    catch(err){
        console.log(err);
        req.flash('errorMsg', 'Erro inesperado');
        res.redirect('/admin/denuncias/usuarios')
    }
})

module.exports = router;