import pool from "../database/db.js";

export const criarCompra = async (req, res) => {
    const { id_prod, vendedor, quantidade, valor_unitario, data_compra, data_pagamento } = req.body;
    try {
        await pool.query(
            'INSERT INTO compra (id_prod, vendedor, quantidade, valor_unitario, data_compra, data_pagamento) VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6)',
            [id_prod, vendedor, quantidade, valor_unitario, data_compra, data_pagamento]
        );
        res.status(201).json({ message: "Compra salva" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const listarCompra = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM compra');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const mostrarCompra = async (req, res) => {
    const { id_compra } = req.params;
    try {
        const result = await pool.query('SELECT * FROM compra WHERE id_compra = $1', [id_compra]);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Compra não encontrada" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const atualizarCompra = async (req, res) => {
    const { id_compra } = req.params;
    const { id_prod, vendedor, quantidade, valor_unitario, data_compra, data_pagamento } = req.body;
    try {
        const result = await pool.query(
            'UPDATE compra SET id_prod = COALESCE($1, id_prod), vendedor = COALESCE($2, vendedor), quantidade = COALESCE($3, quantidade), valor_unitario = COALESCE($4, valor_unitario), data_compra = COALESCE($5, data_compra), data_pagamento = COALESCE($6, data_pagamento) WHERE id_compra = $7',
            [id_prod, vendedor, quantidade, valor_unitario, data_compra, data_pagamento, id_compra]
        );

        if(result.rowCount === 0) {
            return res.status(404).json({ message: "Compra não encontrada" });
        }
        res.status(200).json({ message: "Compra atualizada" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const deletarCompra = async (req, res) => {
    const { id_compra } = req.params;
    try {
        await pool.query('DELETE FROM compra WHERE id_compra = $1', [id_compra]);
        res.status(200).json({ message: "Compra deletada" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
