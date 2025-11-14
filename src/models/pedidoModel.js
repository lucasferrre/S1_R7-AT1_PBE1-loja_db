const { pool } = require('../config/db');

const pedidoModel = {

    selectPedido: async () => {
        const sql = 'SELECT * FROM pedidos;';
        const [rows] = await pool.query(sql);
        return rows;
    },


    selectItemById: async (pIdItem) => {
        const sql = 'SELECT id_item FROM itens_pedido WHERE id_item = ?;';
        const values = [pIdItem];
        const [rows] = await pool.query(sql, values);
        return rows;
    },



    insertPedido: async (pIdCliente, pValorTotal, pDataPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction(); // essa função aguarda até que aparece um commit ou um rollback
            // insert 1 - tabela pedidos
            const sqlPedido = 'INSERT INTO pedidos (id_cliente, valor_total, data_pedido) values (?,?,?);'
            const valuesPedido = [pIdCliente, pValorTotal, pDataPedido];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);


            // insert 2 - itens_pedido
            const sqlItem = 'INSERT INTO itens_pedido(id_pedido, id_produto, quantidade, valor_item) values (?,?,?,?);'
            const valuesItem = [rowsPedido.insertId, pIdProduto, pQuantidadeItem, pValorItem]
            const [rowsItem] = await connection.query(sqlItem, valuesItem)


            connection.commit();

            return { rowsPedido, rowsItem };

        } catch (error) {
            connection.rollback();
            throw error;

        }
    },


    // insert intens posterior a criação do pedido
    insertItem: async (pIdPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        const connection = await pool.getConnection();
        try {

            await connection.beginTransaction();

            const sqlItem = 'INSERT INTO itens_pedido(id_pedido, id_produto, quantidade, valor_item) values (?,?,?,?);';
            const valuesItem = [pIdPedido, pIdProduto, pQuantidadeItem, pValorItem];
            const [rowsItem] = await pool.query(sqlItem, valuesItem);

            const sqlPedido = 'UPDATE pedidos SET valor_total = valor_total + (?*?) WHERE id_pedido = ?;';
            const valuesPedido = [pQuantidadeItem, pValorItem, pIdPedido];
            const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);

            connection.commit();
            return { rowsItem, rowsPedido };

        } catch (error) {
            connection.rollback();
            throw error;
        }
    },


    updateQtdItem: async (pIdItem, pQuantidade) => {
        const sql = 'UPDATE itens_pedido SET quantidade = ? WHERE id_item =?;';
        const values = [pQuantidade, pIdItem];
        const [rows] = await pool.query(sql, values)
        // Tabela pedido é atualizada com a TRIGGER trg_atualiza_valor_pedido_after_update
        return rows;
    },

    deleteItem: async (pIdPedido, pIdItem) => {
        const sql = 'DELETE FROM itens_pedido WHERE id_item = ? AND id_pedido= ?;';
        const values = [pIdItem, pIdPedido];
        const [rows] = await pool.query(sql, values);
        // Tabela pedido é atualizada com a TRIGGER trg_atualiza_valor_pedido_after_delete
        return rows;
    },

};

module.exports = { pedidoModel };