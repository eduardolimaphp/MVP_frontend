let listarAtivo = true;

function toggleListarProdutos() {
    document.getElementById('buscar_produto_texto').value = '';

    listarProdutos();
}

function listarProdutos() {
    listarAtivo = true;
    document.getElementById('lista-produtos').innerHTML = '';

    fetch('http://127.0.0.1:5000/produtos')
        .then(response => response.json())
        .then(data => {
            let produtos = '';

            data.produtos.forEach(produto => {
                 produtos += normalizaLinhaProduto(produto)
            })

            document.getElementById('lista-produtos').innerHTML = produtos;
        });
}


let produtoVendaId = null;
let quantidadeMaxima = null;

function prepararVenda(id, quantidade) {
    produtoVendaId = id;
    quantidadeMaxima = quantidade;
    document.getElementById('quantidade_venda').max = quantidade;
}


function confirmarVenda() {
    const quantidadeVenda = parseInt(document.getElementById('quantidade_venda').value);

    if (!produtoVendaId) {
        showMessageModal('Produto não selecionado para venda.');
        return;
    }

    if (quantidadeVenda <= 0 || quantidadeVenda > quantidadeMaxima) {
        showMessageModal('Erro: A quantidade que você está tentando vender é inválida!');
        return;
    }

    fetch(`http://127.0.0.1:5000/produtos/${produtoVendaId}`)
        .then(response => response.json())
        .then(produto => {
            if (produto.produtos?.length == 0) {
                showMessageModal('Ocorreu um erro ao realizar venda');
                return;
            }

            const novaQuantidade = produto.produtos[0].quantidade_produto - quantidadeVenda;

            if (novaQuantidade < 0) {
                showMessageModal('Erro: A quantidade que você está tentando vender é maior que a quantidade disponível em estoque!');
                return;
            }

            // Se a nova quantidade é 0 ou a quantidade de venda 
            // é igual à quantidade em estoque, deleta o produto
            if (novaQuantidade === 0) {
                return fetch(`http://127.0.0.1:5000/produtos/${produtoVendaId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantidade_produto: novaQuantidade })
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Erro ao deletar o produto');
                        showMessageModal('Venda realizada! O produto foi deletado pois acabou.');
                    });
            }

            return fetch(`http://127.0.0.1:5000/produtos/${produtoVendaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade_produto: novaQuantidade })
            })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao atualizar o produto');
                    showMessageModal(`Venda de ${quantidadeVenda} unidades do produto ID: ${produtoVendaId} realizada! Nova quantidade: ${novaQuantidade}`);
                });
        })
        .catch(error => {
            console.error('Erro ao vender o produto:', error);
            showMessageModal('Erro ao realizar a venda. Por favor, tente novamente.');
        })
        .finally(() => {
            const modalVenda = new bootstrap.Modal(document.getElementById('vendaModal'));
            modalVenda.hide();
            listarProdutos();
        });
}

function showMessageModal(message) {
    document.getElementById('messageModalBody').textContent = message;
    const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    messageModal.show();
    setTimeout(() => {
        messageModal.hide();
    }, 3000);
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
        .then(() => {
            window.location.reload();
        })
        .catch(error => showMessageModal(error));
}

function deletarProduto_completo(id) {
    if (!id) {
        showMessageModal('ID do produto não especificado.');
        return;
    }

    fetch(`http://127.0.0.1:5000/produtos/removeregistro/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(error => console.error('Erro:', error));
}

function exibirProduto(id) {
    fetch(`http://127.0.0.1:5000/produtos/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('produto-detalhes').innerHTML = 'ID: ' + data.id + '<br>Nome: ' + data.nome_produto + '<br>Preço: ' + data.preco_produto + '<br>Quantidade: ' + data.quantidade_produto;
        });
}

function deletarProduto(id) {
    if (!id) {
        showMessageModal('Não foi possível deletar o produto.');
        return
    }

    fetch(`http://127.0.0.1:5000/produtos/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            listarProdutos();
        })
        .catch(error => console.error('Erro:', error));
}

function buscarProduto() {
    const busca = document.getElementById('buscar_produto_texto').value;
    const tabela = document.getElementById('lista-produtos');
    const errorMsgProdutoNaoEncontrado = `
        <tr>
            <td colspan="6">Produto não encontrado</td>
        </tr>
    `;

    if (!busca) {
        alert('ID do produto não especificado.');
        return;
    }

    fetch(`http://127.0.0.1:5000/produtos/${busca}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(produto => {
            if (produto.length == 0) {
                tabela.innerHTML = errorMsgProdutoNaoEncontrado;
                return;
            }
            let produtos = ''
            produto.produtos.forEach(produto => {
                produtos += normalizaLinhaProduto(produto);
            })
            console.log(produtos)
            tabela.innerHTML = produtos;

            return;
        })
        .catch(error => {
            console.error('Erro:', error);
            tabela.innerHTML = errorMsgProdutoNaoEncontrado;
        });

}

function normalizaLinhaProduto(produto) {
    return `
        <tr>
            <td>${produto.id}</td>
            <td>${produto.data_de_cadastro}</td>
            <td>${produto.nome_produto}</td>
            <td>R$ ${parseFloat(produto.preco_produto).toFixed(2)}</td>
            <td>${produto.quantidade_produto}</td>
            <td><button onclick="prepararVenda(${produto.id}, ${produto.quantidade_produto})" data-bs-toggle="modal" data-bs-target="#vendaModal" class="btn btn-success btn-sm">Realizar Venda</button>
            <button onclick="deletarProduto_completo(${produto.id})" class="btn btn-danger btn-sm">Excluir Produto</button></td>
        </tr>
    `;
}

window.onload = listarProdutos;
