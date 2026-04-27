import pool from "../database/db";

export const relatorio = async (req, res) => {
    const { modo, mes, ano } = req.query;

    if(!mes || !ano) {
        return res.status(400).json({ message: "Mês e Ano são obrigatórios" });
    }

    const mesInt = parseInt(mes);
    const anoInt = parseInt(ano);

    try {
        let result;

        if(modo === "historico") {
            result = await pool.query(`
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
            WHERE
                EXTRACT(MONTH FROM c.data_compra) = $1 AND EXTRACT(YEAR FROM c.data_compra) = $2
                OR
                EXTRACT(MONTH FROM c.data_pagamento) = $1 AND EXTRACT(YEAR FROM c.data_pagamento) = $2
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
            WHERE
                EXTRACT(MONTH FROM c.data_venda) = $1 AND EXTRACT(YEAR FROM c.data_venda) = $2
                OR
                EXTRACT(MONTH FROM c.data_recebimento) = $1 AND EXTRACT(YEAR FROM c.data_recebimento) = $2
            `, [mesInt, anoInt]);
        } else if(modo === "compra") {
            result = await pool.query(`
            SELECT
                c.id_compra,
                p.nome AS nome_prod,
                cl.nome_cliente,
                c.quantidade,
                c.valor_unitario,
                c.valor_total,
                c.data_compra,
                c.data_pagamento
            FROM compra c
            JOIN produtos p ON c.id_prod = p.id_prod
            JOIN cliente cl ON c.id_cliente = cl.id_cliente
            WHERE
                EXTRACT(MONTH FROM c.data_compra) = $1 AND EXTRACT(YEAR FROM c.data_compra) = $2
                OR
                EXTRACT(MONTH FROM c.data_pagamento) = $1 AND EXTRACT(YEAR FROM c.data_pagamento) = $2
            ORDER BY c.data_compra
            `, [mesInt, anoInt]);
        } else if(modo === "venda") {
            result = await pool.query(`
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
                EXTRACT(MONTH FROM c.data_venda) = $1 AND EXTRACT(YEAR FROM c.data_venda) = $2
                OR
                EXTRACT(MONTH FROM c.data_recebimento) = $1 AND EXTRACT(YEAR FROM c.data_recebimento) = $2
            ORDER BY c.data_venda
            `);
        } else {
            return res.status(400).json({ message: "Modo invalido. Disponiveis: Compra, Venda ou Historico" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}