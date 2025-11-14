const { produtoModel } = require('../models/produtoModel');

const produtoController = {

    /**
     * Retorna os produtos cadastrados 
     * Rota GET /produtos
     * @async
     * @function selecionaTodos
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<object} Objeto contendo o resultado da consulta
     */

    selecionaTodos: async (req, res) => {
        try {
            const idProduto = req.query.idProduto;
            const consulta = idProduto ? produtoModel.selectById(idProduto) : produtoModel.selectAll();
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
    incluiRegistro: async (req,res) => {
        try {
            const {descricao, valor} = req.body;

            if (!descricao || !valor || !isNaN(descricao) || isNaN(valor)) {
                return res.status(400).json({message: 'Verifique os dados enviados e tente novamente'});
            };

            const resultado = await produtoModel.insert(descricao,valor);

            if (resultado.insertId === 0) {
                throw new Error ('Ocorreu um erro ao incluir o produto');
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
    alteraProduto: async (req, res) => {
        try {
            const idProduto = Number(req.params.idProduto);
            const {descricao, valor} = req.body;

            if (!idProduto || (!descricao && !valor) || (!isNaN(descricao) && isNaN(valor)) || typeof idProduto !="number") {
                return res.status(400).json({message: 'Verifique os dados enviados e tente novamente'});
            };

            const produtoAtual = await produtoModel.selectById(idProduto);

            if (produtoAtual.length === 0) {
                return res.status(200).json({message: 'Produto não localizado'});
            };
            
            const novaDescricao = descricao ?? produtoAtual[0].nome_produto; // coalescência nula ( ?? )
            const novoValor = valor ?? produtoAtual[0].valor_produto;


            const resultUpdate = await produtoModel.update(idProduto, novaDescricao, novoValor);

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
deletaProduto: async (req, res) => {
    try {
        const idProduto = Number(req.params.idProduto);

        if (!idProduto || !Number.isInteger(idProduto)) {
            return res.status(400).json({message: 'Forneça um indentificador válido.'}); 
        };

        const produtoSelecionado = await produtoModel.selectById(idProduto)

        if (produtoSelecionado.length === 0) {
            return res.status(200).json({message: 'Produto não localizado.'})
        };

        const resultadoDelete = await produtoModel.delete(idProduto)

        if (resultadoDelete.affectedRows === 0) {
            return res.status(200).json({message: 'Ocorreu um erro ao deletar o produto.'})
        };

        res.status(200).json({message: 'Produto excluído com sucesso!'});

        
    } catch (error) {
        res.status(500).json({
            message: `Ocorreu um erro no servidor`,
            errorMessage: error.message
        });
    };
}

};

module.exports = { produtoController };