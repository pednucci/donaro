const db = require('../database/database');
const { isAuth } = require('../helpers/isAuth');
const path = require('path')

exports.newOrder = async (req, res) => {
    const conn = await db.connection();
    const titulo = req.body.titulo;
    const dtPed = new Date(req.body.dtPedido);
    const meta = req.body.metaPedido;
    const estado = req.body.estado;
    const cidade = req.body.cidade;
    const desc = req.body.descPed;
    let fileUpload;
    let uploadPath;

    //console.log(req.body.tpf[0])

    try {
        const idUser = req.user[0].cd_usuario;
        const pedido = await conn.query(`INSERT INTO pedido(cd_usuario_pedido, nm_titulo_pedido,
            nm_meta_pedido, dt_encerramento_pedido, nm_cidade_pedido,
            sg_estado_pedido, ds_acao_pedido) VALUES(?,?,?,?,?,?,?)
            `, [idUser, titulo, meta, dtPed, cidade, estado, desc]);

        const idPedido = pedido[0].insertId;
        

        if(req.files){
            fileUpload = req.files.picPed;
            uploadPath = path.join(__dirname, '..', '..', '/public/assets/pedidos/' + fileUpload.name)  ;
            fileUpload.mv(uploadPath, async (err) => {
                if(err){
                    req.flash("errorMsg", "Houve um erro ao cadastrar o pedido!")
                    console.log(err)
                    res.redirect('/')
                }
                else{
                    await conn.query(`UPDATE pedido SET cd_imagem_pedido = ? WHERE
                    cd_pedido = ?`, [fileUpload.name, idPedido])
                }
            })
        }
        
        if(typeof req.body.alMedida == 'object'){
            for(let i = 0; i<req.body.alMedida.length; i++) {

                await conn.query(`INSERT INTO alimento
                (nm_alimento, cd_pedido, nm_medida_alimento, qt_alimento, nm_tipoFisico_alimento)
                VALUES(?,?,?,?,?)`
                , [req.body.alimentoInput[i], idPedido, req.body.alMedida[i],
                 req.body.quantidade[i], req.body.tpf[i]])
            }
        }
        if(typeof req.body.alMedida == 'string'){
            await conn.query(`INSERT INTO alimento
                (nm_alimento, cd_pedido, nm_medida_alimento, qt_alimento, nm_tipoFisico_alimento)
                VALUES(?,?,?,?,?)`
                , [req.body.alimentoInput, idPedido, req.body.alMedida,
                 req.body.quantidade, req.body.tpf])
        }

        if(meta == 'fechada'){
            await conn.query(`
            UPDATE pedido SET qt_total_pedido = 
            (select sum(qt_alimento) from alimento where cd_pedido = ?) WHERE cd_pedido = ?
            `, [idPedido, idPedido])
        }
        req.flash('successMsg', 'Pedido cadastrado com sucesso!')
        res.redirect('/')
    }
    catch(err) {
        console.log(err)
    }

    /*
    const titulo = req.body[0].titulo
    const dataPed = new Date(req.body[0].data);
    const meta = req.body[0].meta;
    const estado = req.body[0].estado;
    const cidade = req.body[0].cidade;
    const descricao = req.body[0].descricao;
    //let fileUpload;
    //let uploadPath;

    try {
        
        const idUser = req.user[0].cd_usuario;
        const pedido = await conn.query(`INSERT INTO pedido(cd_usuario_pedido, nm_titulo_pedido,
            nm_meta_pedido, dt_encerramento_pedido, nm_cidade_pedido,
            sg_estado_pedido, ds_acao_pedido) VALUES(?,?,?,?,?,?,?)
            `, [idUser, titulo, meta, dataPed, cidade, estado, descricao]);

        const idPedido = pedido[0].insertId;

        
        fileUpload.mv(uploadPath, async () => {
            await conn.query(`UPDATE pedido SET cd_imagem_pedido = ? WHERE
            cd_pedido = ?`, [fileUpload.name, idPedido])
        })

        req.body[1].forEach(async alimento => {
            await conn.query(`INSERT INTO alimento
                (nm_alimento, cd_pedido, nm_medida_alimento, qt_alimento, nm_tipoFisico_alimento)
                VALUES(?,?,?,?,?)`
                , [alimento.alimento, idPedido, alimento.medida, alimento.quantidade, alimento.tipoFisic])
        });

        if(meta == 'fechada'){
            await conn.query(`
            UPDATE pedido SET qt_total_pedido = 
            (select sum(qt_alimento) from alimento where cd_pedido = ?) WHERE cd_pedido = ?
            `, [idPedido, idPedido])
        }


        res.status(200).send("Pedido cadastrado com sucesso!")
    }
    catch(err) {
        console.log(err)
        res.status(500).send("Erro ao cadastrar o pedido!")
    }
    */
    
    await conn.end();
}