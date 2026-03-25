import { Router } from "express";
import { criarCliente, listarCliente, mostrarCliente, atualizarCliente, deletarCliente, infosCliente } from "../controller/clienteController.js";

const route = Router();

route.post('/', criarCliente);
route.get('/', listarCliente);
route.get('/infos/:id_cliente', infosCliente); // special get
route.get('/:nome_cliente', mostrarCliente);
route.patch('/:id_cliente', atualizarCliente);
route.delete('/:id_cliente', deletarCliente);


export default route;