import express from 'express';
import cors from 'cors';

import prodRoute from './routes/produtoRoutes.js';
import compRoute from './routes/compraRoutes.js';
import vendRoute from './routes/vendaRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use('/produto', prodRoute);
app.use('/compra', compRoute);
app.use('/venda', vendRoute);

app.listen(PORT, () => {
    console.log(`Conectado na porta ${PORT}`);
});