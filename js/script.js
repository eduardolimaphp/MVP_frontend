let listarAtivo = false;

function toggleListarProdutos() {
    listarAtivo = !listarAtivo;
    document.getElementById('botao-toggle').innerHTML = listarAtivo ? 'Ocultar' : 'Exibir';
    if (listarAtivo) {
        listarProdutos();
    } else {
        document.getElementById('lista-produtos').innerHTML = '';
    }
}

function listarProdutos() {
    if (!listarAtivo) return;

    fetch('http://127.0.0.1:5000/produtos')
        .then(response => response.json())
        .then(data => data.produtos.forEach(produto => {
            document.getElementById('lista-produtos').innerHTML += '<tr><td>' + produto.id + '</td><td>' + produto.data_de_cadastro + '</td><td>' + produto.nome_produto + '</td><td>' + produto.preco_produto + '</td><td>' + produto.quantidade_produto + '</td></tr>';
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


function deletarProduto() {
    const id = document.getElementById('produto_id').value;
    if (id) {
        fetch(`http://127.0.0.1:5000/produtos/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Atualizar a lista de produtos ou recarregar a página aqui, se necessário
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




