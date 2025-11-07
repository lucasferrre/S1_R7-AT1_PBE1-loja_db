const { clienteModel } = require('../models/clienteModel');

const clienteController = {

    /**
     * Retorna os clientes cadastrados 
     * Rota GET /clientes
     * @async
     * @function selecionaTodosClientes
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<object} Objeto contendo o resultado da consulta
     */

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



// post
    incluiRegistroCliente: async (req,res) => {
        try {
            const {nome, cpf} = req.body;

            if (!nome || !cpf || !isNaN(nome) || isNaN(cpf)) {
                return res.status(400).json({message: 'Verifique os dados enviados e tente novamente'});
            };

            const cpfExistente = await clienteModel.selectByCpf(cpf)

            if (cpfExistente && cpfExistente.length > 0) {
                return res.status(409).json({message: 'O CPF informado já existe no sistema. Não foi possivel realizar a inserção'});                     
            }

            const resultado = await clienteModel.insert(nome, cpf);

            if (resultado.insertId === 0) {
                throw new Error ('Ocorreu um erro ao incluir o cliente');
            }

            res.status(201).json({message: 'Registro incluindo com sucesso', data:resultado});

        } catch (error) {
            res.status(500).json({
                message: `Ocorreu um erro no servidor`,
                errorMessage: error.message
            });
        };
    },



// put
    alteraCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            const {nome, cpf} = req.body;

            if (!idCliente || (!nome && !cpf) || (!isNaN(nome) && isNaN(cpf)) || typeof idCliente !="number") {
                return res.status(400).json({message: 'Verifique os dados enviados e tente novamente'});
            };

            const cpfExistente = await clienteModel.selectByCpf(cpf)

            if (cpfExistente && cpfExistente.length > 0) {
                return res.status(409).json({message: 'O CPF informado já existe no sistema. Não foi possivel realizar a alteração'});                     
            }


            const clienteAtual = await clienteModel.selectById(idCliente);

            if (clienteAtual.length === 0) {
                return res.status(200).json({message: 'Produto não localizado'});
            };
            
            const novoNome = nome ?? clienteAtual[0].nome_cliente; // coalescência nula ( ?? )
            const novoCpf = cpf ?? clienteAtual[0].cpf_cliente;


            const resultUpdate = await clienteModel.update(idCliente, novoNome, novoCpf);

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 0) {
                return res.status(200).json({message: 'Não há alterações a serem realizadas.'});
            };

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 1) {
                res.status(200).json({message: 'O registro foi alterado com sucesso.'});
            };


        } catch (error) {
            res.status(500).json({
                message: `Ocorreu um erro no servidor`,
                errorMessage: error.message
            });
        };
    },

// delete 
deletaCliente: async (req, res) => {
    try {
        const idCliente = Number(req.params.idCliente);

        if (!idCliente || !Number.isInteger(idCliente)) {
            return res.status(400).json({message: 'Forneça um indentificador válido.'}); 
        };

        const clienteSelecionado = await clienteModel.selectById(idCliente)

        if (clienteSelecionado.length === 0) {
            return res.status(200).json({message: 'Produto não localizado.'})
        };

        const resultadoDelete = await clienteModel.delete(idCliente)

        if (resultadoDelete.affectedRows === 0) {
            return res.status(200).json({message: 'Ocorreu um erro ao deletar o produto.'})
        };

        res.status(201).json({message: 'Produto excluído com sucesso!'});

        
    } catch (error) {
        res.status(500).json({
            message: `Ocorreu um erro no servidor`,
            errorMessage: error.message
        });
    };
}

};

module.exports = { clienteController };