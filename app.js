//Criando lista de produtos inspecionados
let produtosInspecionados = [];

function enviar() {

    //EXECUTAR AO CLICAR NO BOTÃO ENVIAR

    //Coletando informações dos campos:
    let serial = document.getElementById("numero_serie").value;
    let material = document.getElementById("material").value;
    let descricao = document.getElementById("descricao").value;
    let ordem = document.getElementById("ordem").value;
    let data = document.getElementById("data").value;
    let inspetor = document.getElementById("inspetor").value;
    let resultado = document.getElementById("resultado").value;
    console.log(`Valores coletados:\n`);
    console.log(`Serial: ${serial}`);
    console.log(`Material: ${material}`);
    console.log(`Descrição: ${descricao}`);
    console.log(`Ordem: ${ordem}`);
    console.log(`Data: ${data}`);
    console.log(`Inspetor: ${inspetor}`);
    console.log(`Resultado: ${resultado}`);

    //Criando objeto:
    let produto = {
        serial: serial,
        material: material,
        descricao: descricao,
        ordem: ordem,
        data: data,
        inspetor: inspetor,
        resultado: resultado
    };

    //Enviando objeto para a lista:
    produtosInspecionados.push(produto);

    //Mostrando na forma de tabela no console:
    console.table(produtosInspecionados);

    // Enviar os dados para o servidor:
    fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        carregarProdutos(); // Atualiza a tabela após o envio

    // Limpar os campos do formulário:
    document.getElementById("numero_serie").value = "";
    document.getElementById("material").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("ordem").value = "";
    document.getElementById("data").value = "";
    document.getElementById("inspetor").value = "";
    document.getElementById("resultado").value = "";

    //Identificar erros:
    })
    .catch(error => console.error('Erro:', error));

    //Confirmação de que funcionou.
    alert("Dados enviados com sucesso.");
};

// Função para buscar os produtos:
function carregarProdutos() {
    fetch('http://localhost:3000/produtos')
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById('produtos-tabela');
            tabela.innerHTML = '';

            // Salvar os dados no contexto global para usar na função baixar()
            window.produtosData = data;

            data.forEach(produto => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${produto.serial}</td>
                    <td>${produto.material}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.ordem}</td>
                    <td>${produto.data}</td>
                    <td>${produto.inspetor}</td>
                    <td>${produto.resultado}</td>
                `;
                tabela.appendChild(linha);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
}

// Ouvinte de evento para DOMContentLoaded:
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos(); // Chamar aqui para carregar produtos ao iniciar a página

    // Adicionar evento ao botão de baixar
    document.getElementById('baixar-btn').addEventListener('click', baixar);
});

// Função para baixar o Excel:
function baixar() {
    const ws = XLSX.utils.json_to_sheet(window.produtosData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");

    // Gerar o arquivo e iniciar o download
    XLSX.writeFile(wb, "produtos.xlsx");
}