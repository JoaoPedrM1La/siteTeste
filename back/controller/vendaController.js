import pool from "../database/db.js";

export const criarVenda = async (req, res) => {
    const { id_prod, id_cliente, quantidade, valor_unitario, data_venda, data_recebimento } = req.body;
    try {
        await pool.query(
            'INSERT INTO venda (id_prod, id_cliente, quantidade, valor_unitario, data_venda, data_recebimento) VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), COALESCE($6, CURRENT_DATE))',
            [id_prod, id_cliente, quantidade, valor_unitario, data_venda, data_recebimento]
        )
        res.status(201).json({ message: "Venda salva" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const listarVenda = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT
            v.id_venda,
            p.nome AS nome_prod,
            cl.nome_cliente,
            v.quantidade, 
            v.valor_unitario,
            v.valor_total,
            v.data_venda,
            v.data_recebimento
        FROM venda v
        JOIN produtos p ON v.id_prod = p.id_prod
        JOIN cliente cl ON v.id_cliente = cl.id_cliente
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const mostrarVenda = async (req, res) => {
    const { value } = req.params;
    try {
        const result = await pool.query(`
        SELECT
            v.id_venda,
            p.nome AS nome_prod,
            cl.nome_cliente,
            v.quantidade, 
            v.valor_unitario,
            v.valor_total,
            v.data_venda,
            v.data_recebimento
        FROM venda v
        JOIN produtos p ON v.id_prod = p.id_prod
        JOIN cliente cl ON v.id_cliente = cl.id_cliente
        WHERE
            p.nome ILIKE $1 OR
            cl.nome_cliente ILIKE $1    
        `, [`%${value}%`]);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Venda não encontrada" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const atualizarVenda = async (req, res) => {
    const { id_venda } = req.params;
    const { id_prod, id_cliente, quantidade, valor_unitario, valor_total, data_venda, data_recebimento } = req.body;
    try {
        const result = await pool.query(
            'UPDATE venda SET id_prod = COALESCE($1, id_prod), id_cliente = COALESCE($2, id_cliente), quantidade = COALESCE($3, quantidade), valor_unitario = COALESCE($4, valor_unitario), valor_total = COALESCE($5, valor_total), data_venda = COALESCE($6, data_venda), data_recebimento = COALESCE($7, data_recebimento) WHERE id_venda = $8',
            [id_prod, id_cliente, quantidade, valor_unitario, valor_total, data_venda, data_recebimento, id_venda]
        )

        if(result.rowCount === 0) {
            return res.status(404).json({ message: "Venda não encontrada" });
        }
        res.status(200).json({ message: "Venda atualizada" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const deletarVenda = async (req, res) => {
    const { id_venda } = req.params;
    try {
        await pool.query('DELETE FROM venda WHERE id_venda = $1', [id_venda]);
        res.status(200).json({ message: "Venda deletada" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}