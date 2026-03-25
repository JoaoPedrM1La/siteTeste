import { Router } from "express";
import { criarCompra, listarCompra, mostrarCompra, atualizarCompra, deletarCompra } from "../controller/compraController.js"

const route = Router();

route.post('/', criarCompra);
route.get('/', listarCompra);
route.get('/:value', mostrarCompra);
route.patch('/:id_compra', atualizarCompra);
route.delete('/:id_compra', deletarCompra);

export default route;
