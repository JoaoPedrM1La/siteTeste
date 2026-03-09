import pool from "../database/db.js";

export const criarVenda = async (req, res) => {
    const { id_prod, comprador, quantidade, valor_unitario, data_venda, data_recebimento } = req.body;
    try {
        await pool.query(
            'INSERT INTO venda (id_prod, comprador, quantidade, valor_unitario, data_venda, data_recebimento) VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), COALESCE($6, CURRENT_DATE))',
            [id_prod, comprador, quantidade, valor_unitario, data_venda, data_recebimento]
        )
        res.status(201).json({ message: "Venda salva" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const listarVenda = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM venda');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const mostrarVenda = async (req, res) => {
    const { id_venda } = req.params;
    try {
        const result = await pool.query('SELECT * FROM venda WHERE id_venda = $1', [id_venda]);

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
    const { id_prod, comprador, quantidade, valor_unitario, valor_total, data_venda, data_recebimento } = req.body;
    try {
        const result = await pool.query(
            'UPDATE venda SET id_prod = COALESCE($1, id_prod), comprador = COALESCE($2, comprador), quantidade = COALESCE($3, quantidade), valor_unitario = COALESCE($4, valor_unitario), valor_total = COALESCE($5, valor_total), data_venda = COALESCE($6, data_venda), data_recebimento = COALESCE($7, data_recebimento) WHERE id_venda = $8',
            [id_prod, comprador, quantidade, valor_unitario, valor_total, data_venda, data_recebimento, id_venda]
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