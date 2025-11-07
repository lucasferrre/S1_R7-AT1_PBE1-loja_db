const express = require('express');
const clienteRotes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clienteRotes.get('/clientes', clienteController.selecionaTodosClientes);
clienteRotes.post('/clientes', clienteController.incluiRegistroCliente);
clienteRotes.put('/clientes/:idCliente', clienteController.alteraCliente);
clienteRotes.delete('/clientes/:idCliente', clienteController.deletaCliente);

module.exports = { clienteRotes }