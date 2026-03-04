import { Router } from "express";
import { criarVenda, listarVenda, mostrarVenda, atualizarVenda, deletarVenda } from "../controller/vendaController.js";

const route = Router();

route.post('/', criarVenda);
route.get('/', listarVenda);
route.get('/:id_venda', mostrarVenda);
route.patch('/:id_venda', atualizarVenda);
route.delete('/:id_venda', deletarVenda);

export default route;