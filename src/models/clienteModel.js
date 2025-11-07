const { pool } = require('../config/db');

const clienteModel = {
    /**
     * Retorna todos os clientes cadastrados na tabela clientes
     * @async
     * @function selectAll
     * @returns {promise<Array<object>} retorna um array de objetos, cada objeto representa um cliente 
     * @example 
     * const clientes = await clienteModel.selectAll();
     * console.log(clientes)
     * // Saída esperada
     * // tras o resultado de cada linha da tabela
     * [
     *      {coluna1: 'ValorColuna1',coluna2: 'ValorColuna2',....}
     *      {coluna1: 'ValorColuna1',coluna2: 'ValorColuna2',....}
     * ]
     */
    selectAll: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },


    selectById: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
        const values = [pId]
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    

    selectByCpf: async (pCpf) => {
        const sql = 'SELECT cpf_cliente FROM clientes WHERE cpf_cliente=?;';
        const values = [pCpf]
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    /**
     * Insere um cliente na base de dados
     * @param {string} pNome Nome do cliente. EX:'Fulano de Tal'
     * @param {string} pCpf CPF do cliente (apenas dígitos). EX: '11122233304'
     * @returns {Promise<Object>} Retorna objeto contendo propriedades sobre o resultado da execução da query
     * @example
     * const result = await clienteModel.insert(paramA, paramB);
     * // saída
	 * "result": {
     *	    "fieldCount": 0,
     *	    "affectedRows": 1,
     *	    "insertId": 1,
     *	    "info": "",
     *	    "serverStatus": 2,
     *	    "warningStatus": 0,
     *	    "changedRows": 0
	 *   }
     */
    insert: async (pNome, pCpf) => {
        const sql = 'INSERT INTO clientes(nome_cliente, cpf_cliente) VALUES (?,?);';
        const values = [pNome, pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


/**
 * 
 * @param {number} pId 
 * @param {string} pNome 
 * @param {string} pCpf 
 * @returns {Promise<Object>}
 */

    update: async (pId, pNome, pCpf) => {
        const sql = 'UPDATE clientes SET nome_cliente=?, cpf_cliente=? WHERE id_cliente =?;';
        const values = [pNome, pCpf, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    delete: async (pId) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;

    }

};


module.exports = { clienteModel };
