const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {

    criarPedido: async (req, res) => {
        try {
            const { id_cliente, valor_total, data_pedido, id_produto, quantidade, valor_item } = req.body;

            if (!id_cliente || !valor_total || !data_pedido || !id_produto || !quantidade || !valor_item) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }


            const resultado = await pedidoModel.insertPedido(id_cliente, valor_total, data_pedido, id_produto, quantidade, valor_item);

            res.status(201).json({ message: 'Registro incluido com sucesso!', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });

        };

    },


    criarItem: async (req, res) => {
        try {
            const { id_pedido, id_produto, quantidade, valor_item } = req.body;

            if (!id_pedido || !id_produto || !quantidade || !valor_item) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }


            const resultado = await pedidoModel.insertItem(id_pedido, id_produto, quantidade, valor_item);

            res.status(201).json({ message: 'Registro incluido com sucesso!', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });

        };

    },



    alterarItem: async (req, res) => {
        try {
            const idItem = Number(req.params.idItem);
            const { quantidade } = req.body;

            if (!idItem || !quantidade || quantidade <= 0) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            const itemAtual = await pedidoModel.selectItemById(idItem);

            if (itemAtual.length === 0) {
                return res.status(200).json({ message: 'Item não encontrado' });
            };

            const resultUpdade = await pedidoModel.updateQtdItem(idItem, quantidade);

            if (resultUpdade.affectedRows === 1 && resultUpdade.changedRows === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
            };

            if (resultUpdade.affectedRows === 1 && resultUpdade.changedRows === 1) {
                res.status(200).json({ message: 'Registro alterado com sucesso' });
            };


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });

        };

    },

    excluirItem: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const idItem = Number(req.params.idItem);
            

            if (!idPedido || !idItem || !Number.isInteger(idPedido) || !Number.isInteger(idItem)) {
                return res.status(400).json({ message: 'Forneça um indentificador válido' });
            }

            const itemSelecionado = await pedidoModel.selectItemById(idItem);

            if (itemSelecionado.length === 0) {
                return res.status(200).json({ message: 'Item não encontrado na base de dados' });
            };

            const resultadoDelete = await pedidoModel.deleteItem(idPedido, idItem);
            console.log(resultadoDelete.affectedRows);

            if (resultadoDelete.affectedRows == 0) {
                return res.status(200).json({message: 'Ocorreu um erro ao excluir o item.'})
            };
    
            res.status(200).json({message: 'Item excluído com sucesso!', data: resultadoDelete});
            

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });

        };

    },


};


module.exports = { pedidoController }