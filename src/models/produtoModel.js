const { fdatasync } = require('fs');
const { pool } = require('../config/db');

const produtoModel = {
    /**
     * Retorna todos os produtos cadastrados na tabela produtos
     * @async
     * @function selectAll
     * @returns {promise<Array<object} retorna um array de objetos, cada objeto representa um produto 
     * @example 
     * const produtos = await produtoModel.selectAll();
     * console.log(produtos)
     * // Saída esperada
     * // tras o resultado de cada linha da tabela
     * [
     *      {coluna1: 'ValorColuna1',coluna2: 'ValorColuna2',....}
     *      {coluna1: 'ValorColuna1',coluna2: 'ValorColuna2',....}
     * ]
     */
    selectAll: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await pool.query(sql);
        return rows;
    },


    selectById: async (pId) => {
        const sql = 'SELECT * FROM produtos WHERE id_produto=?;';
        const values = [pId]
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    /**
     * Insere um produto na base de dados
     * @param {string} pNomeProd Descrição do nome do produto que deve ser inserido no banco de dados. EX:'Teclado'
     * @param {number} pValorProd Valor do produto que deve ser inserido no banco de dados. EX: 126.23
     * @returns {Promise<Object>} Retorna objeto contendo propriedades sobre o resultado da execução da query
     * @example
     * const result = await produtoModel.insert(paramA, paramB, .....);
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
    insert: async (pNomeProd, pValorProd) => {
        const sql = 'INSERT INTO produtos(nome_produto,valor_produto) VALUES (?,?);';
        const values = [pNomeProd, pValorProd];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


/**
 * 
 * @param {*} pId 
 * @param {*} pDescricao 
 * @param {*} pValor 
 * @returns 
 */

    update: async (pId, pDescricao, pValor) => {
        const sql = 'UPDATE produtos SET nome_produto=?, valor_produto=? WHERE id_produto =?;';
        const values = [pDescricao, pValor, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    delete: async (pId) => {
        const sql = 'DELETE FROM produtos WHERE id_produto=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;

    }

};


module.exports = { produtoModel };
