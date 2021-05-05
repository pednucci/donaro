const db = require('../database/database');
const { isAuth } = require('../helpers/isAuth');

exports.newOrder = async (req, res) => {
    const conn = await db.connection();

    const titulo = req.body[0].titulo
    const dataPed = new Date(req.body[0].data);
    const meta = req.body[0].meta;
    const estado = req.body[0].estado;
    const cidade = req.body[0].cidade;
    const descricao = req.body[0].descricao;

    try {
        const idUser = req.user[0].cd_usuario;
        const pedido = await conn.query(`INSERT INTO pedido(cd_usuario_pedido, nm_titulo_pedido,
            nm_meta_pedido, dt_encerramento_pedido, nm_cidade_pedido,
            sg_estado_pedido, ds_acao_pedido) VALUES(?,?,?,?,?,?,?)
            `, [idUser, titulo, meta, dataPed, cidade, estado, descricao]);

        idPedido = pedido[0].insertId;

        req.body[1].forEach(async alimento => {
            await conn.query(`INSERT INTO alimento
                (nm_alimento, cd_pedido, nm_medida_alimento, qt_alimento, nm_tipoFisico_alimento)
                VALUES(?,?,?,?,?)`
                , [alimento.alimento, idPedido, alimento.medida, alimento.quantidade, alimento.tipoFisic])
        });
        res.status(200).send("Pedido cadastrado com sucesso!")
    }
    catch {
        res.status(500).send("Erro ao cadastrar o pedido!")
    }
    
    await conn.end();
}