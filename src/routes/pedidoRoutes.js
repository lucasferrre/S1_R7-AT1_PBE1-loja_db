const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.post('/pedidos', pedidoController.criarPedido);
pedidoRoutes.post('/pedidos/novoItem', pedidoController.criarItem);
pedidoRoutes.patch('/pedidos/:idItem', pedidoController.alterarItem);
pedidoRoutes.delete('/pedidos/:idPedido/:idItem', pedidoController.excluirItem);



module.exports = { pedidoRoutes };