const express = require('express');
const router = express.Router();
const { produtoRoutes } = require('./produtoRoutes');
const { clienteRotes } = require('./clienteRoutes');

router.use('/', produtoRoutes);
router.use('/', clienteRotes);

module.exports = { router }
