let listarAtivo = true;

function toggleListarProdutos() {
    document.getElementById('buscar_produto_id').value = '';
    //document.getElementById('botao-toggle').innerHTML = listarAtivo ? 'Resetar Busca de Produtos' : 'Exibir Todos os Produtos';

    if (listarAtivo) {
        listarProdutos();
    } else {
        document.getElementById('lista-produtos').innerHTML = '';
    }

    //listarAtivo = !listarAtivo;
}


function listarProdutos() {
    listarAtivo = true;
    document.getElementById('lista-produtos').innerHTML = '';

    fetch('http://127.0.0.1:5000/produtos')
        .then(response => response.json())
        .then(data => data.produtos.forEach(produto => {
            document.getElementById('lista-produtos').innerHTML +=
                `<tr>
                <td>${produto.id}</td>
                <td>${produto.data_de_cadastro}</td>
                <td>${produto.nome_produto}</td>
                <td>R$ ${parseFloat(produto.preco_produto).toFixed(2)}</td>
                <td>${produto.quantidade_produto}</td>
                <td><button onclick="deletarProduto(${produto.id})" class="btn btn-danger btn-sm">Deletar</button></td>
            </tr>`;
        }));
}


function cadastrarProduto(event) {
    event.preventDefault();

    const data_de_cadastro = document.getElementById('data_de_cadastro').value;
    const nome_produto = document.getElementById('nome_produto').value;
    const preco_produto = document.getElementById('preco_produto').value;
    const quantidade_produto = document.getElementById('quantidade_produto').value;

    const formData = new FormData();
    formData.append('data_de_cadastro', data_de_cadastro);
    formData.append('nome_produto', nome_produto);
    formData.append('preco_produto', preco_produto);
    formData.append('quantidade_produto', quantidade_produto);

    fetch('http://127.0.0.1:5000/produtos', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(error => console.log(error));
}


function deletarProduto_completo(id) {
    if (id) {
        fetch(`http://127.0.0.1:5000/produtos/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(error => console.error('Erro:', error));
    } else {
        console.error('ID do produto não especificado.');
    }
}


function exibirProduto(id) {
    fetch(`http://127.0.0.1:5000/produtos/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('produto-detalhes').innerHTML = 'ID: ' + data.id + '<br>Nome: ' + data.nome_produto + '<br>Preço: ' + data.preco_produto + '<br>Quantidade: ' + data.quantidade_produto;
        });
}

function buscarProdutoPorID() {
    const id = document.getElementById('buscar_produto_id').value;
    if (id) {
        fetch(`http://127.0.0.1:5000/produtos/${id}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const tabela = document.getElementById('lista-produtos');
                if (data.error || !data.id) { // Verifique se a resposta contém um erro ou se o ID do produto está ausente
                    tabela.innerHTML = `<tr>
                        <td colspan="6">Produto não encontrado</td>
                    </tr>`;
                } else {
                    tabela.innerHTML = `<tr>
                        <td>${data.id}</td>
                        <td>${data.data_de_cadastro}</td>
                        <td>${data.nome_produto}</td>
                        <td>${data.preco_produto}</td>
                        <td>${data.quantidade_produto}</td>
                        <td><button onclick="deletarProduto(${data.id})" class="btn btn-danger btn-sm">Deletar</button></td>

                    </tr>`;
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                const tabela = document.getElementById('lista-produtos');
                tabela.innerHTML = `<tr>
                    <td colspan="5">Produto não encontrado</td>
                </tr>`;
            });
    } else {
        console.error('ID do produto não especificado.');
    }
}

function deletarProduto(id) {
    if (id) {
        fetch(`http://127.0.0.1:5000/produtos/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                listarProdutos(); // Chame a função listarProdutos para atualizar a lista de produtos.
            })
            .catch(error => console.error('Erro:', error));
    } else {
        console.error('Não foi possível deletar o produto.');
    }
}


window.onload = listarProdutos;




