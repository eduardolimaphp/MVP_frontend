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
                <td><button onclick="prepararVenda(${produto.id}, ${produto.quantidade_produto})" data-bs-toggle="modal" data-bs-target="#vendaModal" class="btn btn-success btn-sm">Realizar Venda</button>
                <button onclick="deletarProduto_completo(${produto.id})" class="btn btn-danger btn-sm">Excluir Produto</button></td>
            </tr>`;
        }));
}


let produtoVendaId = null;
let quantidadeMaxima = null;

function prepararVenda(id, quantidade) {
    produtoVendaId = id;
    quantidadeMaxima = quantidade;
    document.getElementById('quantidade_venda').max = quantidade;
}

function confirmarVenda() {
    if (produtoVendaId) {
        const quantidadeVenda = parseInt(document.getElementById('quantidade_venda').value);
        if (quantidadeVenda > 0 && quantidadeVenda <= quantidadeMaxima) {
            // Aqui, você pode fazer uma chamada API para confirmar a venda.
            // Para o propósito deste exemplo, apenas decrementamos a quantidade do produto.

            // Você pode substituir esta parte por uma chamada API real
            console.log(`Vendeu ${quantidadeVenda} do produto de ID: ${produtoVendaId}`);
            
            // Atualiza a quantidade no servidor
            const novaQuantidade = quantidadeMaxima - quantidadeVenda;
            fetch(`http://127.0.0.1:5000/produtos/${produtoVendaId}`, {
                method: 'PUT',  // Assuma que PUT é o método para atualizar um produto
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantidade_produto: novaQuantidade
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Vendeu ${quantidadeVenda} do produto de ID: ${produtoVendaId}. Nova quantidade: ${novaQuantidade}`);
                } else {
                    console.error('Erro ao vender o produto:', data.message);
                }
            })
            .catch(error => console.error('Erro ao fazer a chamada API:', error));

            
            // Fim da parte substituível

            // Fechar modal
            var modalVenda = new bootstrap.Modal(document.getElementById('vendaModal'));
            modalVenda.hide();
            
            listarProdutos(); // Atualize a lista após a venda.
        } else {
            console.error('Quantidade de venda inválida.');
        }
    } else {
        console.error('Produto não selecionado para venda.');
    }
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
        fetch(`http://127.0.0.1:5000/produtos/removeregistro/${id}`, {
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

function confirmarVenda() {
    if (produtoVendaId) {
        const quantidadeVenda = parseInt(document.getElementById('quantidade_venda').value);
        if (quantidadeVenda > 0 && quantidadeVenda <= quantidadeMaxima) {
            // Calcula a nova quantidade após a venda
            const novaQuantidade = quantidadeMaxima - quantidadeVenda;

            // Criar FormData para armazenar os dados
            const formData = new FormData();
            formData.append('quantidade_produto', novaQuantidade);

            // Atualiza a quantidade no servidor
            fetch(`http://127.0.0.1:5000/produtos/${produtoVendaId}`, {
                method: 'PUT',  // Assuma que PUT é o método para atualizar um produto
                body: formData
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Error with status: ${response.status}`);
                }
            })
            .then(data => {
                console.log(`Vendeu ${quantidadeVenda} do produto de ID: ${produtoVendaId}. Nova quantidade: ${novaQuantidade}`);
            })
            .catch(error => {
                console.error('Erro ao vender o produto:', error);
            })
            .finally(() => {
                // Fechar modal
                var modalVenda = new bootstrap.Modal(document.getElementById('vendaModal'));
                modalVenda.hide();

                listarProdutos(); // Atualize a lista após a venda.
            });
        } else {
            console.error('Quantidade de venda inválida.');
        }
    } else {
        console.error('Produto não selecionado para venda.');
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




