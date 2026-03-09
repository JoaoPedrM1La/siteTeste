let modoAtual = "estoque";
// make the modal be usable by POST and PATCH
let formModo = "create";
let updId = null;

const config = {
    estoque: {
        title: "Produto",
        route: "http://localhost:3000/produto",
        fields: [
            { name: "nome", type: "text", placeholder: "Nome do produto" },
            { name: "quantidade", type: "number", placeholder: "Quantidade" }
        ]  
    },
    compra: {
        title: "Compra",
        route: "http://localhost:3000/compra",
        fields: [
            { name: "id_prod", type: "number", placeholder: "ID do produto" },
            { name: "vendedor", type: "text", placeholder: "Vendedor" },
            { name: "quantidade", type: "number", placeholder: "Quantidade" },
            { name: "valor_unitario", type: "number", placeholder: "Valor unitário(p/kg)" },
            { name: "data_compra", type: "date", placeholder: "Data da compra" },
            { name: "data_pagamento", type: "date", placeholder: "Data do pagamento" }
        ]
    },
    venda: {
        title: "Venda",
        route: "http://localhost:3000/venda",
        fields: [
            { name: "id_prod", type: "number", placeholder: "ID do produto" },
            { name: "comprador", type: "text", placeholder: "Comprador" },
            { name: "quantidade", type: "number", placeholder: "Quantidade" },
            { name: "valor_unitario", type: "number", placeholder: "Valor unitário(p/kg)" },
            { name: "data_venda", type: "date", placeholder: "Data da venda" },
            { name: "data_recebimento", type: "date", placeholder: "Data de recebimento" }
        ] 
    }
}

// menus
document.getElementById('btnEstoque').addEventListener('click', () => changeMode("estoque"));
document.getElementById('btnCompra').addEventListener('click', () => changeMode("compra"));
document.getElementById('btnVenda').addEventListener('click', () => changeMode("venda"));

// page function
function changeMode(modoNovo) {
    modoAtual = modoNovo;
    console.log(`Modo alterado para ${modoAtual}`);
    localStorage.setItem("modoAtual", modoNovo);
    closeModal();
    loadFunc();
}

// card functions
async function loadFunc() {
    let url = config[modoAtual].route;

    try {
        const resposta = await fetch(url, {
            method: "GET"
        });
        const datas = await resposta.json();

        createTable(datas);
    } catch (error) {
        console.log("Erro na requisição", error);
    }
}

async function createTable(dados) {
    const output = document.getElementById('output');
    output.innerHTML = "";

    const header = tableHeader();
    const body = document.createElement('tbody');

    dados.forEach(dado => {
        const row = tableBody(dado);
        body.appendChild(row);
    });

    output.appendChild(header);
    output.appendChild(body);
}

function tableHeader() {
    const row = document.createElement('thead');

    if(modoAtual === "estoque") {
        row.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Funções</th>
        </tr>
        `;
    } else if(modoAtual === "compra") {
        row.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Vendedor</th>
            <th>Quantidade</th>
            <th>Valor Unit</th>
            <th>Valor Total</th>
            <th>Data Compra</th>
            <th>Data Pagamento</th>
            <th>Funções</th>
        </tr>
        `;
    } else { // venda
        row.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Comprador</th>
            <th>Quantidade</th>
            <th>Valor Unit</th>
            <th>Valor Total</th>
            <th>Data Venda</th>
            <th>Data Recebimento</th>
            <th>Funções</th>
        </tr>
        `;
    }
    return row;
}

function tableBody(dado) {
    const row = document.createElement('tr');

    if(modoAtual === "estoque") {
        row.innerHTML = `
        <td>${dado.nome}</td>
        <td>${dado.quantidade}</td>
        <td>
            <button onclick="delFunc(${dado.id_prod})">Deletar</button>
            <button onclick="updFunc(${dado.id_prod})">Atualizar</button>
        </td>
        `;
    } else if(modoAtual === "compra") {
        row.innerHTML = `
        <td>${dado.id_prod}</td>
        <td>${dado.vendedor}</td>
        <td>${dado.quantidade}</td>
        <td>${dado.valor_unitario}</td>
        <td>${dado.valor_total}</td>
        <td>${formatDate(dado.data_compra)}</td>
        <td>${formatDate(dado.data_pagamento)}</td>
        <td>
            <button onclick="delFunc(${dado.id_compra})">Deletar</button>
            <button onclick="updFunc(${dado.id_compra})">Atualizar</button>
        </td>
        `;
    } else { // venda
        row.innerHTML = `
        <td>${dado.id_prod}</td>
        <td>${dado.comprador}</td>
        <td>${dado.quantidade}</td>
        <td>${dado.valor_unitario}</td>
        <td>${dado.valor_total}</td>
        <td>${formatDate(dado.data_venda)}</td>
        <td>${formatDate(dado.data_recebimento)}</td>
        <td>
            <button onclick="delFunc(${dado.id_venda})">Deletar</button>
            <button onclick="updFunc(${dado.id_venda})">Atualizar</button>
        </td>
        `;
    }
    return row;
}

function formatDate(date) {
    const TZ = date.split("T")
    const [year, month, day] = TZ[0].split("-");
    return `${day}/${month}/${year}`;
}

async function delFunc(id) {
    let url = `${config[modoAtual].route}/${id}`;

    try {
        await fetch(url, {
            method: "DELETE"
        });
    } catch (error) {
        console.log("Erro na requisição", error);
    }
    loadFunc();
}

async function updFunc(id) {
    formModo = "update";
    updId = id;

    let url = `${config[modoAtual].route}/${id}`;

    openModal();
    //fillField(datas);
    try {
        const resposta = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        const datas = await resposta.json();
    } catch (error) {
        console.log("Erro na requisição");
    }
    loadFunc();
}

// autofill for PATCH
function fillField(datas, id) {


    const form = document.getElementById('dynamicForm');

    config[modoAtual].fields.forEach(field => {
        if(form.elements[field.name]) {
            form.elements[field.name].value = datas[field.name] ?? "";
        }
    });
}

// modal functions
function closeModal() {
    document.getElementById('modal').style.display = "none";
}

function openModal() {
    const form = document.getElementById('dynamicForm');
    const title = document.getElementById('modalTitle');

    form.innerHTML = "";

    const configuration = config[modoAtual];

    title.textContent = configuration.title;

    configuration.fields.forEach(field => {
        const input = document.createElement('input');
        input.type = field.type;
        input.name = field.name;
        input.placeholder = field.placeholder;
        //input.required = true; // retirar (false -> quantidade.prod, data_compra/venda)

        form.appendChild(input);
    });
    document.getElementById('modal').style.display = "flex";
}

// open modal page for POST
document.getElementById('btnAdd').addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
});
// modal save btn for POST and PATCH
document.getElementById('btnSave').addEventListener('click', async(e) => {
    e.preventDefault();

    const form = document.getElementById('dynamicForm');
    const dados = {};
    const configuration = config[modoAtual];

    configuration.fields.forEach(field => {
        let valor = form.elements[field.name].value;

        // dont put any value in dados
        if(valor === "") {
            return;
        }
        dados[field.name] = valor;
    });

    let url = configuration.route;
    let method = "POST";

    if(formModo === "update") {
        url = `${configuration.route}/${updId}`;
        method = "PATCH";
    }

    try {
        const resposta = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        // reset to POST method
        formModo = "create";
        updId = null;
    } catch (error) {
        console.log("Erro na requisição", error);
    }
    closeModal();
    loadFunc();
});
// modal cancel btn
document.getElementById('btnCancel').addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
});

// search functionality
document.getElementById('btnPesquisar').addEventListener('click', async(e) => {
    e.preventDefault();

    const id = document.getElementById('barPesquisar').value;
    if(!id) {
        return loadFunc();
    }

    let url = `${config[modoAtual].route}/${id}`;

    try {
        const resposta = await fetch(url, {
            method: "GET"
        });
        const dados = await resposta.json();

        createTable(dados);
    } catch (error) {
        console.log("Erro na requisição", error);
    }
});

// load cards after HTML
document.addEventListener('DOMContentLoaded', () => {
    const modoSalvo = localStorage.getItem("modoAtual");
    if(modoSalvo) {
        modoAtual = modoSalvo;
    }
    loadFunc();
});
