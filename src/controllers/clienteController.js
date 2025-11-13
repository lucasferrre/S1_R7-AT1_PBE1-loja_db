const { clienteModel } = require('../models/clienteModel');

const clienteController = {

    /**
     * Retorna um ou todos os clientes cadastrados.
     * Se 'idCliente' for passado na query, ele busca um cliente específico.
     * Rota: GET /clientes  ou  GET /clientes?idCliente=[id] por causa da query
     * @async
     * @function selecionaTodosClientes
     * @param {Request} req Objeto da requisição HTTP. 
     * @param {Response} res Objeto da resposta HTTP.
     * @returns {Promise<void>} Envia uma resposta JSON contendo 'data' com os clientes (200),
     * uma mensagem 'A consulta não retornou resultados' (200) ou um erro (500).
     */

    // get

    selecionaTodosClientes: async (req, res) => {
        try {
            const idCliente = req.query.idCliente;
            const consulta = idCliente ? clienteModel.selectById(idCliente) : clienteModel.selectAll();
            const resultado = await consulta;
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados' });
            }
            res.status(200).json({ data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Ocorreu um erro no servidor`,
                errorMessage: error.message
            });
        }

    },


    /**
     * Inclui um novo cliente no banco de dados.
     * Rota: POST /clientes
     * @async
     * @function incluiRegistroCliente
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP.
     * @returns {Promise<void>} Envia uma resposta JSON de sucesso (201),
     * ou uma mensagem de erro de validação (400), conflito de CPF (409) ou erro de servidor (500).
     */
 
    // post

    incluiRegistroCliente: async (req, res) => {
        try {
            const { nome, cpf } = req.body;

            if (!nome || !cpf || !isNaN(nome) || isNaN(cpf)) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            };

            const cpfExistente = await clienteModel.selectByCpf(cpf)

            if (cpfExistente && cpfExistente.length > 0) {
                return res.status(409).json({ message: 'O CPF informado já existe no sistema. Não foi possivel realizar a inserção' });
            }

            const resultado = await clienteModel.insert(nome, cpf);

            if (resultado.insertId === 0) {
                throw new Error('Ocorreu um erro ao incluir o cliente');
            }

            res.status(201).json({ message: 'Registro incluindo com sucesso', data: resultado });

        } catch (error) {
            res.status(500).json({
                message: `Ocorreu um erro no servidor`,
                errorMessage: error.message
            });
        };
    },


    /**
     * Altera os dados de um cliente existente com base no ID.
     * Rota: PUT /clientes/:idCliente
     * @async
     * @function alteraCliente
     * @param {Request} req Objeto da requisição HTTP. 
     * @param {Response} res Objeto da resposta HTTP.
     * @returns {Promise<void>} Envia uma resposta JSON com mensagem de sucesso (200),
     * "cliente não localizado" (200), "sem alterações" (200),
     * ou uma mensagem de erro de validação (400), conflito de CPF (409) ou erro de servidor (500).
     */

    // put

    alteraCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            const { nome, cpf } = req.body;

            if (!idCliente || (!nome && !cpf) || (!isNaN(nome) && isNaN(cpf)) || typeof idCliente != "number") {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            };

            const cpfExistente = await clienteModel.selectByCpf(cpf)

            if (cpfExistente && cpfExistente.length > 0) {
                return res.status(409).json({ message: 'O CPF informado já existe no sistema. Não foi possivel realizar a alteração' });
            }

            const clienteAtual = await clienteModel.selectById(idCliente);

            if (clienteAtual.length === 0) {
                return res.status(200).json({ message: 'Cliente não localizado' });
            };

            const novoNome = nome ?? clienteAtual[0].nome_cliente; // coalescência nula ( ?? )
            const novoCpf = cpf ?? clienteAtual[0].cpf_cliente;
            
            const resultUpdate = await clienteModel.update(idCliente, novoNome, novoCpf);

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas.' });
            };

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 1) {
                res.status(200).json({ message: 'O registro foi alterado com sucesso.' });
            };


        } catch (error) {
            res.status(500).json({
                message: `Ocorreu um erro no servidor`,
                errorMessage: error.message
            });
        };
    },

    /**
     * Deleta um cliente existente com base no ID.
     * Rota: DELETE /clientes/:idCliente
     * @async
     * @function deletaCliente
     * @param {Request} req Objeto da requisição HTTP. 
     * @param {Response} res Objeto da resposta HTTP.
     * @returns {Promise<void>} Envia uma resposta JSON com mensagem de sucesso (200),
     * "cliente não localizado" (200), ou uma mensagem de erro (400, 500).
     */

    // delete

    deletaCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);

            if (!idCliente || !Number.isInteger(idCliente)) {
                return res.status(400).json({ message: 'Forneça um indentificador válido.' });
            };

            const clienteSelecionado = await clienteModel.selectById(idCliente)

            if (clienteSelecionado.length === 0) {
                return res.status(200).json({ message: 'Cliente não localizado.' })
            };

            const resultadoDelete = await clienteModel.delete(idCliente)

            if (resultadoDelete.affectedRows === 0) {
                return res.status(200).json({ message: 'Ocorreu um erro ao deletar o cliente.' })
            };

            res.status(200).json({ message: 'Cliente excluído com sucesso!' });

        } catch (error) {
            res.status(500).json({
                message: `Ocorreu um erro no servidor`,
                errorMessage: error.message
            });
        };
    }

};

module.exports = { clienteController };