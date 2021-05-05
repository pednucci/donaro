const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const { isAuth } = require('../helpers/isAuth');
const db = require('../database/database')

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

router.post('/cadpedido', newOrderController.newOrder);

module.exports = router


