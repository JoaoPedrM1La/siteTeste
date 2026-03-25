import pool from "../database/db.js";

export const teste = async (req, res) => {
    res.send('Deu bom');
}

export const criarProd = async (req, res) => {
    const { nome, quantidade } = req.body;

    try {
        await pool.query(
            'INSERT INTO produtos (nome, quantidade) VALUES ($1, COALESCE($2, 0))',
            [nome, quantidade]
        );
        res.status(201).json({ message: "Produto salvo" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const listarProd = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const mostrarProd = async (req, res) => {
    const { nome } = req.params;
    try {
        const result = await pool.query('SELECT * FROM produtos WHERE nome ILIKE $1', [`%${nome}%`]);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const atualizarProd = async (req, res) => {
    const { id_prod } = req.params;
    const { nome, quantidade } = req.body;
    try {
        const result = await pool.query(
            'UPDATE produtos SET nome = COALESCE($1, nome), quantidade = COALESCE($2, quantidade) WHERE id_prod = $3',
            [nome, quantidade, id_prod]
        );
        
        if(result.rowCount === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.status(200).json({ message: "Produto atualizado"});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const deletarProd = async (req, res) => {
    const { id_prod } = req.params;
    try {
        await pool.query('DELETE FROM produtos WHERE id_prod = $1', [id_prod]);
        res.status(200).json({ message: "Produto deletado" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
