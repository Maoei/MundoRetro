const express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql2');
var cors = require('cors');
const userController = require('./controllers/userController');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '40028922',
  database: 'dbApiMundoRetro',
});

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//criar rotas
//cadastrar usuarios
//editar usuarios

//cadastrar produtos

//simular estoque
//quando vender um produto remover uma quantidade

//rotas de usuarios
app.get('/getUsers', (req, res) => {
  console.log(req.body);

  // Query to fetch all clients
  const selectQuery = `SELECT id,nome, email, cpfcnpj, DATE_FORMAT(dtnascimento, '%d-%m-%Y') as dtnascimento, usr, senha, genero, telefone FROM clientes`;

  // Run the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching clients');
      throw error;
    }
    res.status(200).json(results);
  });
});

// Rota para obter detalhes do usuário
app.get('/getUser/:id', userController.getUser);

app.post('/createUser', (req, res) => {
  console.log(req.body);

  const { nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone } =
    req.body;

  // Define the SQL query to insert a new user
  const insertUserQuery = `
        INSERT INTO clientes (nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  connection.connect();

  connection.query(
    insertUserQuery,
    [nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone],
    (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Failed to insert user' });
      } else {
        const userId = results.insertId;
        res.status(201).json({ message: 'User added successfully', userId });
      }
    }
  );
});

// Endpoint to update a user
app.put('/updateUser/:id', (req, res) => {
  console.log(req.body);
  const userId = req.params.id;
  console.log('userId ' + userId);

  const { nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone } =
    req.body.clientes;
  console.log('nome ' + req.body.clientes.nome);
  console.log('email ' + req.body.clientes.email);
  console.log('cpfcnpj ' + req.body.clientes.cpfcnpj);
  console.log('dtnascimento ' + req.body.clientes.dtnascimento);
  console.log('usr ' + req.body.clientes.usr);
  console.log('senha ' + req.body.clientes.senha);
  console.log('genero ' + req.body.clientes.genero);
  console.log('telefone ' + req.body.clientes.telefone);

  // Create the UPDATE query
  const updateQuery = `
        UPDATE clientes
        SET nome = ?, email = ?, cpfcnpj = ?, dtnascimento = ?, usr = ?, senha = ?, genero = ?, telefone = ?
        WHERE id = ${userId}
    `;

  connection.connect();

  // Run the query
  connection.query(
    updateQuery,
    [nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone],
    (error, results) => {
      if (error) {
        connection.rollback(() => {
          res.status(500).send('Error updating user');
          throw error;
        });
      }
      res.status(200).send('User updated successfully');
    }
  );
});

//rotas de produtos
app.get('/getProdutos', (req, res) => {
  console.log(req.body);

  // Query to fetch all products
  const selectQuery = 'SELECT * FROM produtos WHERE qtd > 0';

  // Run the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching products');
      throw error;
    }
    res.status(200).json(results);
  });
});

//rotas de produtos com filtro
app.get('/getProdutos/:genero', (req, res) => {
  console.log(req.body);
  genero = req.params.genero;
  console.log('genero ' + genero);

  let selectQuery = '';

  if (genero == 'Todos') {
    selectQuery = `SELECT * FROM produtos WHERE qtd > 0`;
  } else {
    selectQuery = `SELECT * FROM produtos WHERE qtd > 0 AND genero = '${genero}'`;
  }

  // Run the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching products');
      throw error;
    }
    res.status(200).json(results);
  });
});

app.get('/getProduto/:id', (req, res) => {
  console.log(req.body);
  const productId = req.params.id;

  // Query to fetch a single product based on the ID
  const selectQuery = 'SELECT * FROM produtos WHERE id = ?';

  // Run the query
  connection.query(selectQuery, [productId], (error, results) => {
    if (error) {
      res.status(500).send('Error fetching product');
      throw error;
    }

    if (results.length > 0) {
      res.status(200).json(results[0]); // Assuming the ID is unique, so we return the first (and only) result
    } else {
      res.status(404).send('Product not found');
    }
  });
});

app.post('/createProduto', (req, res) => {
  console.log(req.body);

  const { qtd, titulo, descrProduto, dtCompra, genero, valor } = req.body;

  // Create the INSERT query
  const insertQuery = `
    INSERT INTO produtos (qtd, titulo, descrProduto, dtCompra, genero, valor)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Run the query
  connection.query(
    insertQuery,
    [qtd, titulo, descrProduto, dtCompra, genero, valor],
    (error, results) => {
      if (error) {
        res.status(500).send('Error creating product');
        throw error;
      }
      res.status(200).send('Product created successfully');
    }
  );
});

app.put('/updateProduto/:id', (req, res) => {
  console.log(req.body);

  const productId = req.params.id;
  const { qtd, titulo, descrProduto, dtCompra, genero, valor } = req.body;

  // Create the UPDATE query
  const updateQuery = `
      UPDATE produtos
      SET qtd = ?, titulo = ?, descrProduto = ?, dtCompra = ?, genero = ?, valor = ?
      WHERE id = ?
    `;

  // Run the query
  connection.query(
    updateQuery,
    [qtd, titulo, descrProduto, dtCompra, genero, valor, productId],
    (error, results) => {
      if (error) {
        res.status(500).send('Error updating product');
        throw error;
      }
      res.status(200).send('Product updated successfully');
    }
  );
});

//simulacao de estoque
//adicionar produto ao carrinho
app.post('/add-to-cart', (req, res) => {
  const { clienteId, produtoId, qtd } = req.body;

  // Check if the product exists in the cart
  const selectQuery = `SELECT carrinho.*, produtos.qtd as produto_qtd, titulo FROM carrinho JOIN produtos ON carrinho.produto_id = produtos.id WHERE cliente_id = ${clienteId} AND produto_id = ${produtoId}`;

  connection.query(selectQuery, (selectErr, selectResult) => {
    if (selectErr) {
      res.status(500).send('Error checking product in the cart');
    } else {
      if (selectResult.length > 0) {
        const cartQuantity = parseInt(selectResult[0].qtd);
        console.log('cartQuantity: ', cartQuantity);

        const prodQuantity = parseInt(selectResult[0].produto_qtd);
        console.log('prodQuantity: ', prodQuantity);

        const updatedQuantity = parseInt(qtd);
        console.log('updatedQuantity: ', updatedQuantity);

        if (updatedQuantity <= 0) {
          res.status(400).send('Invalid quantity');
          return;
        }

        const diff = cartQuantity - updatedQuantity;
        console.log('diff: ', diff);

        let finalDiff = prodQuantity + diff;
        console.log('finaldiff: ', finalDiff);
        connection.beginTransaction((beginTransactionErr) => {
          if (beginTransactionErr) {
            res.status(500).send('Error starting transaction');
            return;
          }

          const updateProdutosQuery = `UPDATE produtos SET qtd = ${finalDiff} WHERE id = ${produtoId}`;
          connection.query(
            updateProdutosQuery,
            (updateProdErr, updateProdResult) => {
              if (updateProdErr) {
                connection.rollback(() => {
                  res
                    .status(500)
                    .send('Error updating product quantity in produtos table');
                });
                return;
              }

              const updateCarrinhoQuery = `UPDATE carrinho SET qtd = ${updatedQuantity} WHERE cliente_id = ${clienteId} AND produto_id = ${produtoId}`;
              connection.query(
                updateCarrinhoQuery,
                (updateCarrErr, updateCarrResult) => {
                  if (updateCarrErr) {
                    connection.rollback(() => {
                      res
                        .status(500)
                        .send(
                          'Error updating product quantity in carrinho table'
                        );
                    });
                    return;
                  }

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      connection.rollback(() => {
                        res.status(500).send('Error committing transaction');
                      });
                      return;
                    }
                    res
                      .status(200)
                      .send('Product quantity updated in the cart');
                  });
                }
              );
            }
          );
        });
      } else {
        const updateProdutosQuery = `UPDATE produtos SET qtd = qtd - ${qtd} WHERE id = ${produtoId}`;
        connection.query(
          updateProdutosQuery,
          (updateProdErr, updateProdResult) => {
            if (updateProdErr) {
              res
                .status(500)
                .send('Error updating product quantity in produtos table');
              return;
            }

            const insertQuery = `INSERT INTO carrinho (cliente_id, produto_id, qtd) VALUES (${clienteId}, ${produtoId}, ${qtd})`;

            connection.query(insertQuery, (insertErr, insertResult) => {
              if (insertErr) {
                res.status(500).send('Error adding product to the cart');
              } else {
                res.status(200).send('Product added to the cart successfully');
              }
            });
          }
        );
      }
    }
  });
});

// Route to get products associated with carrinho
app.get('/getCarrinho/:id', (req, res) => {
  console.log(req.body);
  const clienteId = req.params.id;

  const query = `
    SELECT carrinho.*, produtos.qtd as produto_qtd, titulo, produtos.valor, produtos.descrProduto
    FROM carrinho
    JOIN produtos ON carrinho.produto_id = produtos.id
    WHERE carrinho.cliente_id = ?
  `;

  connection.query(query, [clienteId], (error, results, fields) => {
    if (error) {
      res.status(500).send('Error fetching carrinho produtos');
      console.error('Error fetching carrinho produtos:', error);
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).send('Carrinho not found or no associated products');
      }
    }
  });
});
//remover produto ao carrinho
app.delete('/removeFromCarrinho/:id', (req, res) => {
  console.log(req.body);
  const carrinhoId = req.params.id; // Acessando o parâmetro 'id' diretamente
  const clienteId = req.body.clienteId;

  const selectQuery =
    'SELECT produto_id, qtd FROM carrinho WHERE id = ? AND cliente_id = ?';
  const deleteQuery = 'DELETE FROM carrinho WHERE id = ? AND cliente_id = ?';
  const updateProdutoQuery = 'UPDATE produtos SET qtd = qtd + ? WHERE id = ?';

  connection.query(
    selectQuery,
    [carrinhoId, clienteId],
    (error, results, fields) => {
      if (error) {
        res.status(500).send('Error retrieving item from carrinho');
        console.error('Error retrieving item from carrinho:', error);
      } else {
        if (results.length > 0) {
          const { produto_id, qtd } = results[0];

          connection.query(
            deleteQuery,
            [carrinhoId, clienteId],
            (deleteError, deleteResults, deleteFields) => {
              if (deleteError) {
                res.status(500).send('Error deleting item from carrinho');
                console.error(
                  'Error deleting item from carrinho:',
                  deleteError
                );
              } else {
                connection.query(
                  updateProdutoQuery,
                  [qtd, produto_id],
                  (updateError, updateResults, updateFields) => {
                    if (updateError) {
                      res.status(500).send('Error updating produtos table');
                      console.error(
                        'Error updating produtos table:',
                        updateError
                      );
                    } else {
                      res
                        .status(200)
                        .send(
                          'Item removed from carrinho and quantity updated in produtos'
                        );
                    }
                  }
                );
              }
            }
          );
        } else {
          res
            .status(404)
            .send('Item not found in carrinho or cliente ID mismatch');
        }
      }
    }
  );
});

//remover todos os itens do carrinho
app.post('/removeAllFromCarrinho', (req, res) => {
  console.log(req.body);
});

//finalizar a compra
app.post('/comprar', (req, res) => {
  console.log(req.body);
});

//rotas de enderecos
// Rota para listar endereços por cliente
app.get('/getEnderecos/:id', (req, res) => {
  const idCliente = req.params.id;
  const query = 'SELECT * FROM enderecos WHERE idCliente = ?';

  connection.query(query, idCliente, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao buscar endereços por cliente.');
      throw error;
    }
    res.json(results);
  });
});

// Rota para listar endereços por cliente e idEndereco
app.get('/getEnderecosId/:idEndereco', (req, res) => {
  const idEndereco = req.params.idEndereco;
  console.log('idEndereco ' + idEndereco);
  const query = `SELECT id, cep, endereco, COALESCE(numero,'') AS numero, COALESCE(complemento,'') AS complemento, bairro, cidade, estado  FROM enderecos WHERE id = ?`;

  connection.query(query, idEndereco, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao buscar endereços por cliente.');
      throw error;
    }
    res.json(results);
  });
});

// Rota para cadastrar um novo endereço para um cliente específico
app.post('/addEndereco/:id', (req, res) => {
  const idCliente = req.params.id;
  const { cep, endereco, numero, complemento, bairro, cidade, estado } =
    req.body;

  const INSERT_ADDRESS_QUERY =
    'INSERT INTO enderecos (cep, endereco, numero, complemento, bairro, cidade, estado, idCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    idCliente,
  ];

  connection.query(INSERT_ADDRESS_QUERY, values, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao cadastrar novo endereço para o cliente.');
      throw error;
    }
    res.status(201).json(results); // Retorna os resultados em formato JSON
    //.send('Novo endereço cadastrado para o cliente com sucesso!');
  });
});

// rotas de cartões
// Rota para listar cartões por cliente
app.get('/getCartoes/:id', (req, res) => {
  const idCliente = req.params.id;
  const query = 'SELECT * FROM cartoes WHERE idCliente = ?';

  connection.query(query, idCliente, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao buscar cartões por cliente.');
      throw error;
    }
    res.json(results); // Retorna os resultados em formato JSON
  });
});

// Rota para listar cartões por idCartao
app.get('/getCartoesId/:idCartao', (req, res) => {
  const idCartao = req.params.idCartao;
  console.log('idCartao ' + idCartao);

  const query = 'SELECT * FROM cartoes WHERE id = ?';

  connection.query(query, idCartao, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao buscar cartões por idCartao.');
      throw error;
    }
    res.json(results);
  });
});

//rota para adicionar novos cartões
app.post('/addCartao/:id', (req, res) => {
  const idCliente = req.params.id;
  console.log('params.id ' + req.params.id);

  const { numeroCartao, nomeCartao, validade, codigoSeguranca } = req.body;
  console.log('body ' + numeroCartao);
  const INSERT_CARD_QUERY =
    'INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) VALUES (?, ?, ?, ?, ?)';
  const values = [
    numeroCartao,
    nomeCartao,
    validade,
    codigoSeguranca,
    idCliente,
  ];

  connection.query(INSERT_CARD_QUERY, values, (error, results, fields) => {
    if (error) {
      console.log('error ' + error);
      res.status(500).send(error);
      throw error;
    }
    res.status(201).json(results); // Retorna os resultados em formato JSON
    //.send('Novo cartão cadastrado para o cliente com sucesso!');
  });
});

app.post('/checkout/finalizar', (req, res) => {
  const {
    idCliente,
    valorFinal,
    idEndereco,
    idEnderecoCobranca,
    valorPago,
    valorDesconto,
    valorFrete,
    pagamentos,
  } = req.body;
  console.log('body ' + req.body.valorPago);

  let status = 'EM PROCESSAMENTO';

  if (
    idCliente &&
    valorFinal &&
    idEndereco &&
    idEnderecoCobranca &&
    pagamentos &&
    valorPago &&
    valorFrete &&
    pagamentos.length > 0
  ) {
    let total = valorFinal + valorFrete;
    const checkoutQuery =
      'INSERT INTO checkout (valorFinal, idCliente, idEndereco, status, valorPago, valorDesconto, valorFrete, idEnderecoCobranca) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(
      checkoutQuery,
      [
        total,
        idCliente,
        idEndereco,
        status,
        valorPago,
        valorDesconto,
        valorFrete,
        idEnderecoCobranca,
      ],
      (checkoutError, checkoutResults, checkoutFields) => {
        if (checkoutError) {
          res.status(500).json({ error: 'Erro ao finalizar o checkout' });
        } else {
          const checkoutId = checkoutResults.insertId;
          let count = 0;

          // Iterar sobre os pagamentos e inserir cada um
          pagamentos.forEach((pagamento) => {
            const insertCheckoutPagamentosQuery =
              'INSERT INTO checkoutPagamentos (idCheckOut, idProduto, idEndereco, valorProduto, status, idCartao, numeroCartao, valorCartao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(
              insertCheckoutPagamentosQuery,
              [
                checkoutId,
                pagamento.idProduto,
                idEndereco,
                pagamento.valorProduto,
                status,
                pagamento.idCartao,
                pagamento.numeroCartao,
                pagamento.valorCartao,
              ],
              (pagamentosError, pagamentosResults, pagamentosFields) => {
                if (pagamentosError) {
                  console.error(
                    'Erro ao adicionar informações do cartão:',
                    pagamentosError
                  );
                  res
                    .status(500)
                    .json({ error: 'Erro ao adicionar informações do cartão' });
                } else {
                  if (count == 0) {
                    count++;
                    // Adicionar produtos à tabela checkoutProdutos
                    pagamentos.forEach((produto) => {
                      const insertCheckoutProdutosQuery =
                        'INSERT INTO checkoutProdutos (idProduto, idCheckOut, valorProduto, status, qtd) VALUES (?, ?, ?, ?, ?)';
                      connection.query(
                        insertCheckoutProdutosQuery,
                        [
                          produto.idProduto,
                          checkoutId,
                          produto.valorProduto,
                          status,
                          produto.qtd,
                        ],
                        (produtosError, produtosResults, produtosFields) => {
                          if (produtosError) {
                            console.error(
                              'Erro ao adicionar produto ao checkout:',
                              produtosError
                            );
                            res
                              .status(500)
                              .json({
                                error: 'Erro ao adicionar produto ao checkout',
                              });
                          }
                        }
                      );
                    });
                  }
                }
              }
            );
          });

          // Limpar o carrinho onde o ID do cliente é igual ao recebido na rota
          const deleteQuery = 'DELETE FROM carrinho WHERE cliente_id = ?';
          connection.query(
            deleteQuery,
            [idCliente],
            (deleteError, deleteResults, deleteFields) => {
              if (deleteError) {
                res
                  .status(500)
                  .json({ error: 'Erro ao limpar o carrinho do cliente' });
              } else {
                res.status(200).json({
                  message:
                    'Checkout concluído com sucesso, carrinho do cliente limpo!',
                });
              }
            }
          );
        }
      }
    );
  } else {
    res.status(400).json({
      error:
        'Campos obrigatórios ausentes. Certifique-se de incluir todos os campos necessários e o ID do cliente.',
    });
  }
});

//rota da tabela checkoutProdutos
app.get('/getCheckoutProdutos', (req, res) => {
  console.log(req.body);
  console.log('testes');
  // Query to fetch all products
  const selectQuery = `SELECT checkoutProdutos.idProduto, checkoutProdutos.idCheckOut, checkoutProdutos.valorProduto, checkoutProdutos.status,
            produtos.qtd, produtos.titulo, produtos.descrProduto, produtos.dtCompra, produtos.genero, produtos.valor 
    FROM checkoutProdutos 
    JOIN produtos ON produtos.id = checkoutProdutos.idProduto`;

  // Run the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching products');
      throw error;
    }
    res.status(200).json(results);
  });
});

//rota da tabela checkoutProdutos com filtro
app.get('/getCheckoutProdutos/:status', (req, res) => {
  console.log(req.body);
  let statusPedidos = req.params.status;
  console.log('statusPedidos' + statusPedidos);

  let selectQuery = '';

  if (statusPedidos == 'TODOS') {
    selectQuery = `SELECT *
    FROM checkout`;
  } else {
    selectQuery = `SELECT *
    FROM checkout
  WHERE checkout.status = '${statusPedidos}'`;
  }
  // Run the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching products');
      throw error;
    }
    res.status(200).json(results);
  });
});

app.get('/getCheckoutProdutos/:id', (req, res) => {
  const idCheckout = req.params.idCheckout;
  console.log('idCheckout ' + idCheckout);
  // Query to fetch products for a specific idCheckout
  const selectQuery = `SELECT checkoutProdutos.idProduto, checkoutProdutos.idCheckOut, checkoutProdutos.valorProduto, checkoutProdutos.status,
    produtos.qtd, produtos.titulo, produtos.descrProduto, produtos.dtCompra, produtos.genero, produtos.valor 
    FROM checkoutProdutos 
    JOIN produtos ON produtos.id = checkoutProdutos.idProduto
    WHERE checkoutProdutos.idCheckOut = ?`;

  // Run the query with the specified idCheckout
  connection.query(selectQuery, [idCheckout], (error, results) => {
    if (error) {
      res
        .status(500)
        .send('Error fetching products for the specified idCheckout');
      throw error;
    }
    res.status(200).json(results);
  });
});

//rota para validar cupom
app.get('/getCheckoutProdutosDetalhe/:id', (req, res) => {
  const idCheckout = req.params.id;
  console.log('idCheckout ' + idCheckout);
  // Query to fetch products for a specific idCheckout
  const selectQuery = `SELECT checkoutProdutos.id, checkoutProdutos.idProduto, checkoutProdutos.idCheckOut, checkoutProdutos.valorProduto, checkoutProdutos.status,
    produtos.qtd, produtos.titulo, produtos.descrProduto, produtos.dtCompra, produtos.genero, produtos.valor 
    FROM checkoutProdutos 
    JOIN produtos ON produtos.id = checkoutProdutos.idProduto
    WHERE checkoutProdutos.idCheckOut = ?`;

  // Run the query with the specified idCheckout
  connection.query(selectQuery, [idCheckout], (error, results) => {
    if (error) {
      res
        .status(500)
        .send('Error fetching products for the specified idCheckout');
      throw error;
    }
    res.status(200).json(results);
  });
});

// Rota para validar o cupom
app.post('/validarCupom', (req, res) => {
  const idCliente = req.body.idCliente;
  const codigoCupom = req.body.cupom;

  console.log('idCliente ' + idCliente);
  console.log('codigoCupom ' + codigoCupom);

  // Consulta ao banco de dados para validar o cupom
  const query = `SELECT * FROM cupons WHERE codigoCupon = ? AND idCliente = ?`;

  connection.query(
    query,
    [codigoCupom, idCliente],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }

      if (results.length > 0) {
        // Cupom válido
        res.json({ mensagem: 'Cupom válido', valor: results[0].valor });
      } else {
        // Cupom inválido
        res.json({ mensagem: 'Cupom inválido' });
      }
    }
  );
});

// Rota para trocar o status da compra pelo Admin
app.post('/trocarStatus', (req, res) => {
  const idCheckOut = req.body.idCheckOut;
  const idCheckOutProduto = req.body.idCheckOutProduto;
  const novoStatus = req.body.status;
  const obs = req.body.observacao;
  const idProduto = req.body.idProduto;
  const valorCupom = req.body.valorCupom;
  const idCliente = req.body.idCliente;
  const qtd = req.body.qtd;

  console.log('idCheckOut ' + idCheckOut);
  console.log('novoStatus ' + novoStatus);
  console.log('idCheckOutProduto ' + idCheckOutProduto);

  // Query to update the status in checkout table
  const updateCheckoutQuery = `UPDATE checkout SET status = ?, observacao = ? WHERE id = ?`;

  // Query to update the status in checkoutProdutos table
  const updateCheckoutProdutosQuery = `UPDATE checkoutProdutos SET status = ? WHERE idCheckOut = ? AND idProduto = ? AND id = ?`;

  if (novoStatus == 'TROCA APROVADA') {
    const selectProdutoQuery = `SELECT * FROM produtos WHERE id = ${idProduto} `;

    connection.query(selectProdutoQuery, (selectErr, selectResult) => {
      const prodQuantity = parseInt(selectResult[0].qtd);

      let finalDiff = prodQuantity + qtd;
      console.log('finaldiff: ', finalDiff);
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          res.status(500).send('Error starting transaction');
          return;
        }

        const updateProdutosQuery = `UPDATE produtos SET qtd = ${finalDiff} WHERE id = ${idProduto}`;
        connection.query(
          updateProdutosQuery,
          (updateProdErr, updateProdResult) => {}
        );
      });
    });
  }

  // Query to update the status in checkoutPagamentos table
  const updateCheckoutPagamentosQuery = `UPDATE checkoutPagamentos SET status = ? WHERE idCheckOut = ?`;

  // Query to insert a new cupon in the cupons table
  const insertCuponsQuery = `INSERT INTO cupons (codigoCupon, tipoCupom, descrCupom, dtValidade, valor, idCliente) VALUES (?, ?, ?, ?, ?, ?)`;

  // Function to generate a random coupon
  const createCupom = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Define the characters allowed in the coupon
    let cupom = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      cupom += characters.charAt(randomIndex);
    }
    return `CUPOM${cupom}`;
  };

  // Function to get the current date and add 7 days
  const calculateExpirationDate = () => {
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // Add 7 days
    return expirationDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Run the update queries
  connection.beginTransaction((err) => {
    if (err) {
      res.status(500).send('Error updating status. Transaction start failed.');
      throw err;
    }

    connection.query(
      updateCheckoutQuery,
      [novoStatus, obs, idCheckOut],
      (error, results) => {
        if (error) {
          connection.rollback(() => {
            res.status(500).send('Error updating status in checkout table.');
            throw error;
          });
        }

        connection.query(
          updateCheckoutProdutosQuery,
          [novoStatus, idCheckOut, idProduto, idCheckOutProduto],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                res
                  .status(500)
                  .send('Error updating status in checkoutProdutos table.');
                throw error;
              });
            }

            connection.query(
              updateCheckoutPagamentosQuery,
              [novoStatus, idCheckOut],
              (error, results) => {
                if (error) {
                  connection.rollback(() => {
                    res
                      .status(500)
                      .send(
                        'Error updating status in checkoutPagamentos table.'
                      );
                    throw error;
                  });
                }

                // Check if the status is "TROCA APROVADA"
                if (novoStatus === 'TROCA APROVADA') {
                  const cupom = createCupom(); // Generate a random coupon
                  const expirationDate = calculateExpirationDate(); // Calculate expiration date

                  connection.query(
                    insertCuponsQuery,
                    [
                      cupom,
                      'Troca',
                      'Cupom de Troca',
                      expirationDate,
                      valorCupom,
                      idCliente,
                    ],
                    (error, results) => {
                      if (error) {
                        connection.rollback(() => {
                          res
                            .status(500)
                            .send('Error inserting cupon in cupons table.');
                          throw error;
                        });
                      }

                      connection.commit((err) => {
                        if (err) {
                          connection.rollback(() => {
                            res
                              .status(500)
                              .send('Error committing transaction.');
                            throw err;
                          });
                        }

                        res.status(200).json({
                          message:
                            'Status updated successfully in all tables. Cupon inserted.',
                          cupom: cupom,
                        });
                      });
                    }
                  );
                } else {
                  // If status is not "TROCA APROVADA", commit the transaction without generating a cupon
                  connection.commit((err) => {
                    if (err) {
                      connection.rollback(() => {
                        res.status(500).send('Error committing transaction.');
                        throw err;
                      });
                    }

                    res.status(200).json({
                      message:
                        'Status updated successfully in all tables. No cupon inserted.',
                    });
                  });
                }
              }
            );
          }
        );
      }
    );
  });
});

// Rota para buscar todos os cupons disponíveis de um cliente
app.get('/getCuponsDisponiveis/:id', async (req, res) => {
  const idCliente = req.params.id;
  const query = `SELECT * FROM cupons WHERE idCliente = ? AND dtValidade >= DATE_FORMAT(CURDATE(), '%d-%m-%Y')`;

  connection.query(query, idCliente, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao buscar cupons por cliente.');
      throw error;
    }
    res.json(results); // Retorna os resultados em formato JSON
  });
});

// Rota para buscar todos os cupons expirados de um cliente
app.get('/getCuponsExpirados/:id', async (req, res) => {
  const idCliente = req.params.id;
  const query = `SELECT * FROM cupons WHERE idCliente = ? AND dtValidade <= DATE_FORMAT(CURDATE(), '%d-%m-%Y')`;

  connection.query(query, idCliente, (error, results, fields) => {
    if (error) {
      res.status(500).send('Erro ao buscar cupons por cliente.');
      throw error;
    }
    res.json(results); // Retorna os resultados em formato JSON
  });
});

// Rota da tabela checkoutProdutos por cliente
app.get('/getCheckoutProdutosId/:id/:status', (req, res) => {
  const idCliente = req.params.id;
  const statusPedidos = req.params.status;
  console.log('idCliente ' + idCliente);
  console.log('statusPedidos ' + statusPedidos);

  let selectQuery = '';

  if (statusPedidos == 'TODOS') {
    selectQuery = `SELECT checkoutProdutos.idProduto, checkoutProdutos.idCheckOut, checkoutProdutos.valorProduto, checkoutProdutos.status,
    produtos.qtd, produtos.titulo, produtos.descrProduto, produtos.dtCompra, produtos.genero, produtos.valor 
  FROM checkout
  JOIN checkoutProdutos ON checkoutProdutos.idCheckOut = checkout.id
  JOIN produtos ON produtos.id = checkoutProdutos.idProduto
  WHERE checkout.idCliente = ?`;
  } else {
    selectQuery = `SELECT checkoutProdutos.idProduto, checkoutProdutos.idCheckOut, checkoutProdutos.valorProduto, checkoutProdutos.status,
    produtos.qtd, produtos.titulo, produtos.descrProduto, produtos.dtCompra, produtos.genero, produtos.valor 
  FROM checkout
  JOIN checkoutProdutos ON checkoutProdutos.idCheckOut = checkout.id
  JOIN produtos ON produtos.id = checkoutProdutos.idProduto
  WHERE checkout.idCliente = ? AND checkout.status = '${statusPedidos}'`;
  }
  // Query to fetch all products

  // Run the query
  connection.query(selectQuery, [idCliente], (error, results) => {
    if (error) {
      res.status(500).send('Error fetching products');
      throw error;
    }
    res.status(200).json(results);
  });
});

// Rota da tabela checkout por cliente
app.get('/getPedidos/:id/:status', (req, res) => {
  const idCliente = req.params.id;
  const statusPedidos = req.params.status;
  console.log('idCliente ' + idCliente);
  console.log('statusPedidos ' + statusPedidos);

  let selectQuery = '';

  if (statusPedidos == 'TODOS') {
    selectQuery = `SELECT *
    FROM checkout
  WHERE checkout.idCliente = ?`;
  } else {
    selectQuery = `SELECT *
    FROM checkout
  WHERE checkout.idCliente = ? AND checkout.status = '${statusPedidos}'`;
  }
  // Query to fetch all products

  // Run the query
  connection.query(selectQuery, [idCliente], (error, results) => {
    if (error) {
      res.status(500).send('Error fetching products');
      throw error;
    }
    res.status(200).json(results);
  });
});

// Rota da tabela checkout por id
app.get('/getPedidosDetalhe/:id', (req, res) => {
  const idCheckout = req.params.id;
  console.log('idCheckout ' + idCheckout);
  // Query to fetch products for a specific idCheckout

  const selectQuery = `SELECT checkoutProdutos.id, checkoutProdutos.idProduto, checkoutProdutos.idCheckOut, checkoutProdutos.valorProduto, checkoutProdutos.status,
    produtos.qtd, produtos.titulo, produtos.descrProduto, produtos.dtCompra, produtos.genero, produtos.valor 
    FROM checkoutProdutos 
    JOIN produtos ON produtos.id = checkoutProdutos.idProduto
    WHERE checkoutProdutos.idCheckOut = ?`;

  // Run the query with the specified idCheckout
  connection.query(selectQuery, [idCheckout], (error, results) => {
    if (error) {
      res
        .status(500)
        .send('Error fetching products for the specified idCheckout');
      throw error;
    }
    res.status(200).json(results);
  });
});

// Rota para trocar o status para Solicitar Troca
app.post('/trocaSolicitada', (req, res) => {
  const idCheckOut = req.body.idCheckOut;
  const idCheckOutProduto = req.body.idCheckOutProduto;
  const novoStatus = req.body.status;
  const idProduto = req.body.idProduto;

  console.log('trocaSolicitada ');
  console.log('idCheckOut ' + idCheckOut);
  console.log('idCheckOutProduto ' + idCheckOutProduto);
  console.log('novoStatus ' + novoStatus);

  // Query to update the status in checkout table
  const updateCheckoutQuery = `UPDATE checkout SET status = ? WHERE id = ?`;

  // Query to update the status in checkoutProdutos table
  const updateCheckoutProdutosQuery = `UPDATE checkoutProdutos SET status = ? WHERE idCheckOut = ? AND idProduto = ? AND id = ?`;

  // Query to update the status in checkoutPagamentos table
  const updateCheckoutPagamentosQuery = `UPDATE checkoutPagamentos SET status = ? WHERE idCheckOut = ?`;

  // Run the update queries
  connection.beginTransaction((err) => {
    if (err) {
      res.status(500).send('Error updating status. Transaction start failed.');
      throw err;
    }

    connection.query(
      updateCheckoutQuery,
      [novoStatus, idCheckOut],
      (error, results) => {
        if (error) {
          connection.rollback(() => {
            res.status(500).send('Error updating status in checkout table.');
            throw error;
          });
        }

        connection.query(
          updateCheckoutProdutosQuery,
          [novoStatus, idCheckOut, idProduto, idCheckOutProduto],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                res
                  .status(500)
                  .send('Error updating status in checkoutProdutos table.');
                throw error;
              });
            }

            connection.query(
              updateCheckoutPagamentosQuery,
              [novoStatus, idCheckOut],
              (error, results) => {
                if (error) {
                  connection.rollback(() => {
                    res
                      .status(500)
                      .send(
                        'Error updating status in checkoutPagamentos table.'
                      );
                    throw error;
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    connection.rollback(() => {
                      res.status(500).send('Error committing transaction.');
                      throw err;
                    });
                  }

                  res.status(200).json({
                    message: 'Status updated successfully in all tables.',
                  });
                });
              }
            );
          }
        );
      }
    );
  });
});

// Rota para buscar dados do gráfico
app.get('/getGrafico', (req, res) => {
  console.log('ini = ' + req.query.ini);
  console.log('fim = ' + req.query.fim);

  let ini = req.query.ini;
  let fim = req.query.fim;

  try {
    // Organize the fetched data for Chart.js
    const dataByProductId = {};

    // Fetch data from the checkoutPagamentos table
    connection.query(
      `SELECT idProduto, DATE_FORMAT(dtCompra, "%Y-%m-%d") AS dtCompra, valorProduto 
      FROM checkoutPagamentos
      WHERE dtCompra BETWEEN '${ini}' AND '${fim}'`,
      (error, resuts) => {
        resuts.forEach((row) => {
          const { idProduto, dtCompra, valorProduto } = row;

          if (!dataByProductId[idProduto]) {
            dataByProductId[idProduto] = [];
          }

          //dataByProductId[idProduto].push({ dtCompra, valorProduto });
          dataByProductId[idProduto][dtCompra] = parseFloat(valorProduto);
        });

        // Get all unique dates across all idProduto
        const allDates = Array.from(
          new Set(
            Object.values(dataByProductId).flatMap((obj) => Object.keys(obj))
          )
        ).sort();

        // Ensure all idProduto have entries for all dates, inserting 0 when there's no entry
        Object.values(dataByProductId).forEach((productData) => {
          allDates.forEach((date) => {
            if (!(date in productData)) {
              productData[date] = 0;
            }
          });
        });

        // Prepare the data to be sent as a response
        // const response = {
        //   labels: [...new Set(resuts.map(row => row.dtCompra))], // Unique dates for x-axis labels
        //   datasets: Object.entries(dataByProductId).map(([idProduto, data]) => ({
        //     label: `ID ${idProduto}`,
        //     data: data.map(entry => entry.valorProduto),
        //     borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random border color
        //     fill: false
        //   }))
        // };

        // Prepare the final response
        const formattedData = {
          labels: allDates,
          datasets: Object.entries(dataByProductId).map(
            ([idProduto, productData]) => ({
              label: `ID ${idProduto}`,
              data: allDates.map((date) => productData[date]),
              borderColor: `#${Math.floor(Math.random() * 16777215).toString(
                16
              )}`, // Random border color
              fill: false,
            })
          ),
        };

        res.json(formattedData);
      }
    );
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//rota da tabela aprovarCompras
app.get('/aprovarCompras', (req, res) => {
  console.log(req.body);
  console.log('testes');
  // Query to fetch all products
  const updateCheckoutQuery = `UPDATE checkout SET status = 'PEDIDO APROVADO' WHERE status = 'EM PROCESSAMENTO' `;

  const updateCheckoutProdutosQuery = `UPDATE checkoutProdutos SET status = 'PEDIDO APROVADO' WHERE status = 'EM PROCESSAMENTO' `;

  const updateCheckoutPagamentosQuery = `UPDATE checkoutPagamentos SET status = 'PEDIDO APROVADO' WHERE status = 'EM PROCESSAMENTO' `;

  // Run the query
  connection.query(updateCheckoutQuery, (error, results) => {});
  connection.query(updateCheckoutProdutosQuery, (error, results) => {});
  connection.query(updateCheckoutPagamentosQuery, (error, results) => {});
  res.status(200);
});

app.post('/teste', (req, res) => {
  console.log(req.body.teste);

  connection.connect();

  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) throw err;
    console.log('The solution is: ', rows);
  });

  connection.end();

  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
