import pool from "../database/db.js";

export const criarCliente = async (req, res) => {
    const { nome_cliente, saldo } = req.body;
    try {
        await pool.query(
            'INSERT INTO cliente (nome_cliente, saldo) VALUES ($1, COALESCE($2, 0))',
            [nome_cliente, saldo]
        );
        res.status(201).json({ message: "Cliente salvo" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const listarCliente = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const mostrarCliente = async (req, res) => {
    const { nome_cliente } = req.params;
    try {
        const result = await pool.query('SELECT * FROM cliente WHERE nome_cliente ILIKE $1', [`%${nome_cliente}%`]);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const atualizarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    const { nome_cliente, saldo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cliente SET nome_cliente = COALESCE($1, nome_cliente), saldo = COALESCE($2, saldo) WHERE id_cliente = $3',
            [nome_cliente, saldo, id_cliente]
        );

        if(result.rowCount === 0) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }
        res.status(200).json({ message: "Cliente atualizado" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const deletarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        await pool.query('DELETE FROM cliente WHERE id_cliente = $1', [id_cliente]);
        res.status(200).json({ message: "Cliente deletado" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const infosCliente = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        const result = await pool.query(`
        SELECT
            c.id_compra AS id,
            'compra' AS tipo,
            p.nome AS nome_prod,
            cl.nome_cliente,
            c.quantidade,
            c.valor_unitario,
            c.valor_total,
            c.data_compra AS data_inicio,
            c.data_pagamento AS data_final
        FROM compra c
        JOIN produtos p ON c.id_prod = p.id_prod
        JOIN cliente cl ON c.id_cliente = cl.id_cliente
        WHERE c.id_cliente = $1

        UNION ALL

        SELECT
            v.id_venda AS id,
            'venda' AS tipo,
            p.nome AS nome_prod,
            cl.nome_cliente,
            v.quantidade, 
            v.valor_unitario,
            v.valor_total,
            v.data_venda AS data_inicio,
            v.data_recebimento AS data_final
        FROM venda v
        JOIN produtos p ON v.id_prod = p.id_prod
        JOIN cliente cl ON v.id_cliente = cl.id_cliente
        WHERE v.id_cliente = $1
        `, [id_cliente]);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Dados não encontrados" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}