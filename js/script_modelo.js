function listarProdutos() {
    fetch('http://127.0.0.1:5000/produtos')
        .then(response => response.json())
        .then(data => data.produtos.forEach(produto => {
            document.getElementById('lista-produtos').innerHTML += '<tr><td>' + produto.id + '</td><td>' + produto.nome_produto + '</td><td>' + produto.preco_produto + '</td><td>' + produto.quantidade_produto + '</td></tr>'
        }))
}

listarProdutos();

function cadastrarProduto(data_de_cadastro, nome_produto, preco_produto, quantidade_produto) {
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
        .then(data => console.log(data))

}

form.onsubmit = (event) => {
    event.preventDefault();
    cadastrarProduto(
        document.getElementById('data_de_cadastro').value,
        document.getElementById('nome_produto').value,
        document.getElementById('preco_produto').value,
        document.getElementById('quantidade_produto').value,
    )
}


function cadastrarProduto(data_de_cadastro, nome_produto, preco_produto, quantidade_produto) {
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
        .then(data => console.log(data));
}