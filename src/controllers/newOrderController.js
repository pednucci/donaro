const db = require('../database/database');
const { isAuth } = require('../helpers/isAuth');
const { isPast } = require('date-fns');
const path = require('path')

exports.newOrder = async (req, res) => {
    var erros = [];
    const conn = await db.connection();
    const titulo = req.body.titulo;
    const dtPed = req.body.dtPedido;
    const estado = req.body.estado;
    const cidade = req.body.cidade;
    const desc = req.body.descPed;
    let fileUpload;
    let uploadPath;

    try {
        if(desc == '' || estado == '0' || cidade == '0' || titulo == ''|| dtPed == ''
        || typeof req.body.alimentoInput == 'undefined'){
            erros.push({text: 'Não deixe campos em branco!'})
        }
        if(typeof req.body.alimentoInput == 'string' && (!req.body.quantidade || req.body.quantidade <= 0)){
            erros.push({text: 'A quantidade mínima é 1'})
        }
        if(typeof req.body.alimentoInput == 'object'){
            let alimentos = [];
            let quantidades = [];
            var id = 0;
            for(i = 0; i<req.body.alimentoInput.length; i++){
                quantidades[i] = req.body.quantidade[i];
                alimentos[i] = req.body.alimentoInput[i];
                if(!req.body.quantidade[i] || req.body.quantidade[i] <= 0) id = 1;
            }
            if(!(alimentos.length === new Set(alimentos).size)){
                erros.push({text: 'Não repita alimentos!'})
            }
            if(id == 1){
                erros.push({text: 'A quantidade mínima é 1!'})
            }
        }
        if(isPast(new Date(dtPed))){
            erros.push({text: 'Selecione uma data válida!'})
        }
        if(erros.length > 0){
            const conn = await db.connection();
            const [produtos] = await conn.query('SELECT * FROM produto')
            res.render('pedidos/cadastrar-pedido', {
                erros: erros,
                produtos
            })
            await conn.end();
        }else{
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
    
            req.flash('successMsg', 'Campanha cadastrada com sucesso!')
            res.redirect('/painel/pedidos')
        }
    }
    catch(err) {
        console.log(err)
        req.flash('errorMsg', 'Erro ao cadastrar pedido!')
        res.redirect('/')
    }
    
    await conn.end();
}