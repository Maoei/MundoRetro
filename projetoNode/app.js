const express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql2');
var cors = require('cors');

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
  const selectQuery = 'SELECT * FROM clientes';

  // Run the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching clients');
      throw error;
    }
    res.status(200).json(results);
  });
});

app.get('/getUser/:id', (req, res) => {
  console.log(req.body);
  const clientId = req.params.id;

  // Query to fetch a single client based on the ID
  const selectQuery = 'SELECT * FROM clientes WHERE id = ?';

  // Run the query
  connection.query(selectQuery, [clientId], (error, results) => {
    if (error) {
      res.status(500).send('Error fetching client');
      throw error;
    }

    if (results.length > 0) {
      res.status(200).json(results[0]); // Assuming the ID is unique, so we return the first (and only) result
    } else {
      res.status(404).send('Client not found');
    }
  });
});

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
app.put('/update-user/:userId', (req, res) => {
  console.log(req.body);
  const userId = req.params.userId;
  const { nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone } =
    req.body;

  // Create the UPDATE query
  const updateQuery = `
        UPDATE clientes
        SET nome = ?, email = ?, cpfcnpj = ?, dtnascimento = ?, usr = ?, senha = ?, genero = ?, telefone = ?
        WHERE id = ?
    `;

  connection.connect();

  // Run the query
  connection.query(
    updateQuery,
    [nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone, userId],
    (error, results) => {
      if (error) {
        res.status(500).send('Error updating user');
        throw error;
      }
      res.status(200).send('User updated successfully');
    }
  );

  connection.end();
});

//rotas de produtos

app.get('/getProdutos', (req, res) => {
  console.log(req.body);

  // Query to fetch all products
  const selectQuery = 'SELECT * FROM produtos';

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
  const { clienteId, produtoId, qtd } = req.body; // Assuming data is sent via POST request

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
    SELECT carrinho.*, produtos.qtd as produto_qtd, titulo, produtos.valor
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
  // Obtenha o clienteId de onde quer que você o tenha no aplicativo
  const clienteId = req.body.clienteId; // Exemplo: se estiver no corpo da requisição

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
    res.json(results); // Retorna os resultados em formato JSON
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
  const { idCliente, valorFinal, idEndereco, pagamentos } = req.body;
  console.log('body ' + req.body.idCliente);

  let status = 'EM PROCESSAMENTO';

  if (
    idCliente &&
    valorFinal &&
    idEndereco &&
    pagamentos &&
    pagamentos.length > 0
  ) {
    const checkoutQuery =
      'INSERT INTO checkout (valorFinal, idCliente, idEndereco, status) VALUES (?, ?, ?, ?)';
    connection.query(
      checkoutQuery,
      [valorFinal, idCliente, idEndereco, status],
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
                  res.status(500).json({
                    error: 'Erro ao adicionar informações do cartão',
                  });
                } else {
                  if (count == 0) {
                    count++;
                    // Adicionar produtos à tabela checkoutProdutos
                    const insertCheckoutProdutosQuery =
                      'INSERT INTO checkoutProdutos (idProduto, idCheckOut, valorProduto, status, qtd) VALUES (?, ?, ?, ?, ?)';
                    connection.query(
                      insertCheckoutProdutosQuery,
                      [
                        pagamento.idProduto,
                        checkoutId,
                        pagamento.valorProduto,
                        status,
                        pagamento.qtd,
                      ],
                      (produtosError, produtosResults, produtosFields) => {
                        if (produtosError) {
                          console.error(
                            'Erro ao adicionar produto ao checkout:',
                            produtosError
                          );
                          res.status(500).json({
                            error: 'Erro ao adicionar produto ao checkout',
                          });
                        }
                      }
                    );
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
