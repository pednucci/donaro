const db = require('../database/database');
const { isAuth } = require('../helpers/isAuth');
const path = require('path')

exports.newOrder = async (req, res) => {
    const conn = await db.connection();
    const titulo = req.body.titulo;
    const dtPed = req.body.dtPedido;
    const estado = req.body.estado;
    const cidade = req.body.cidade;
    const desc = req.body.descPed;
    let fileUpload;
    let uploadPath;

    try {
        const idUser = req.user[0].cd_usuario;
        const pedido = await conn.query(`INSERT INTO pedido(cd_usuario_pedido, nm_titulo_pedido,
            dt_encerramento_pedido, nm_cidade_pedido,
            sg_estado_pedido, ds_acao_pedido) VALUES(?,?,?,?,?,?)
            `, [idUser, titulo, dtPed, cidade, estado, desc]);

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
        
        if(typeof req.body.alimentoInput == 'object'){
            for(let i = 0; i<req.body.alimentoInput.length; i++) {

                let medida = await conn.query(`SELECT sg_medida_produto FROM produto WHERE nm_produto =
                ? LIMIT 1`,[req.body.alimentoInput[i]])

                await conn.query(`INSERT INTO alimento
                (nm_alimento, cd_pedido_alimento, nm_medida_alimento, qt_alimento)
                VALUES(?,?,?,?)`
                , [req.body.alimentoInput[i], idPedido, medida[0][0].sg_medida_produto,
                 req.body.quantidade[i]])
            }
        }
        if(typeof req.body.alimentoInput == 'string'){
            
            let medida = await conn.query(`SELECT sg_medida_produto FROM produto WHERE nm_produto =
            ? LIMIT 1`,[req.body.alimentoInput])

            await conn.query(`INSERT INTO alimento
                (nm_alimento, cd_pedido_alimento, nm_medida_alimento, qt_alimento)
                VALUES(?,?,?,?)`
                , [req.body.alimentoInput, idPedido, medida[0][0].sg_medida_produto,
                 req.body.quantidade])
        }

        await conn.query(`
        UPDATE pedido SET qt_total_pedido = 
        (select sum(qt_alimento) from alimento where cd_pedido_alimento = ?) WHERE cd_pedido = ?
        `, [idPedido, idPedido])

        req.flash('successMsg', 'Pedido cadastrado com sucesso!')
        res.redirect('/painel/pedidos')
    }
    catch(err) {
        console.log(err)
        req.flash('errorMsg', 'Erro ao cadastrar pedido!')
        res.redirect('/')
    }
    
    await conn.end();
}