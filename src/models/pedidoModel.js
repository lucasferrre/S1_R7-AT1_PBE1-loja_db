const { pool } = require('../config/db');

const pedidoModel = {

    
    insertPedido: async (pIdCliente, pValorTotal, pDataPedido, pIdProduto, pQuantidadeItem, pValorItem)  => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction(); // essa função aguarda até que aparece um commit ou um rollback
            // insert 1 - tabela pedidos
            const sqlPedido = 'INSERT INTO pedidos (id_cliente, valor_total, data_pedido) values (?,?,?);'
            const valuesPedido = [pIdCliente,pValorTotal,pDataPedido];
            const [rowsPedido] = await connection.query(sqlPedido,valuesPedido);
            

            // insert 2 - itens_pedido
            const sqlItem = 'INSERT INTO itens_pedido(id_pedido,id_produto,quantidade,valor_item) values (?,?,?,?);'
            const valuesItem = [rowsPedido.insertId, pIdProduto, pQuantidadeItem, pValorItem]
            const [rowsItem] = await connection.query(sqlItem, valuesItem)


            connection.commit();

            return {rowsPedido, rowsItem};
        } catch (error) {
            connection.rollback();
            throw error;
            
        }
    }



}

module.exports = { pedidoModel };