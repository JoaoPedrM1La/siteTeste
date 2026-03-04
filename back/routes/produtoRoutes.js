import { Router } from "express";
import { teste, criarProd, listarProd, mostrarProd, atualizarProd, deletarProd } from "../controller/produtoController.js";

const route = Router();

route.get('/teste', teste);
route.post('/', criarProd);
route.get('/', listarProd);
route.get('/:id_prod', mostrarProd);
route.patch('/:id_prod', atualizarProd);
route.delete('/:id_prod', deletarProd);

export default route;