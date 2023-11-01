CREATE DATABASE ecommerce;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cpfcnpj VARCHAR(20) NOT NULL,
    dtnascimento DATE NOT NULL,
    usr VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(10) NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    numero INT NOT NULL,
    complemento VARCHAR(150) ,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado VARCHAR(10) NOT NULL,
    idCliente INT NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES clientes(id)
);

CREATE TABLE cartoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numeroCartao VARCHAR(16) NOT NULL,
    nomeCartao VARCHAR(50) NOT NULL,
    validade VARCHAR(5) NOT NULL,
    codigoSeguranca INT NOT NULL,
    idCliente INT NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES clientes(id)
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    qtd INT,
    titulo VARCHAR(50),
    descrProduto VARCHAR(50),
    dtCompra DATE,
    genero VARCHAR(50),
    valor DECIMAL(16,2)
);

CREATE TABLE cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigoCupon VARCHAR(10),
    tipoCupom VARCHAR(10),
    descrCupom VARCHAR(50),
    dtValidade DATE,
    valor DECIMAL(16,2),
    idCliente INT,
    FOREIGN KEY (idCliente) REFERENCES clientes(id)
);

CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    produto_id INT,
    qtd INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

--INSERT
INSERT INTO clientes (nome, email, cpfcnpj, dtnascimento, usr, senha, genero, telefone) 
VALUES 
('João Silva', 'joao@email.com', '123.456.789-00', '1990-05-15', 'joao123', 'senha123', 'Masculino', '(11) 98765-4321'),
('Maria Santos', 'maria@email.com', '987.654.321-00', '1985-10-20', 'maria88', 'abcd987', 'Feminino', '(22) 12345-6789'),
('Carlos Oliveira', 'carlos@email.com', '111.222.333-44', '1978-12-03', 'carlitos', '123xyz', 'Masculino', '(33) 55555-1234'),
('Ana Souza', 'ana@email.com', '555.666.777-88', '1995-08-27', 'ana23', 'senha1234', 'Feminino', '(44) 87654-3210'),
('Pedro Pereira', 'pedro@email.com', '999.888.777-66', '2000-02-10', 'pedrinho', '9876pwd', 'Masculino', '(55) 23456-7890');

INSERT INTO produtos (qtd, titulo, descrProduto, dtCompra, genero, valor) 
VALUES 
(10, 'Camiseta Listrada', 'Camiseta de algodão listrada', '2023-01-10', 'Moda', 29.99),
(5, 'Tênis Esportivo', 'Tênis para corrida', '2023-02-15', 'Esportes', 79.99),
(20, 'Caneca de Porcelana', 'Caneca com estampa de gato', '2023-03-20', 'Casa', 9.99),
(8, 'Óculos de Sol', 'Óculos escuros polarizados', '2023-04-25', 'Acessórios', 49.99),
(15, 'Fones de Ouvido Bluetooth', 'Fones de ouvido sem fio', '2023-05-05', 'Eletrônicos', 39.99),
(12, 'Bolsa de Couro', 'Bolsa feminina em couro sintético', '2023-06-12', 'Moda', 59.99),
(30, 'Livro de Ficção', 'Best-seller de ficção científica', '2023-07-18', 'Livros', 19.99),
(3, 'Cadeira de Escritório', 'Cadeira ergonômica para escritório', '2023-08-22', 'Casa', 129.99),
(25, 'Relógio Inteligente', 'Smartwatch com monitor cardíaco', '2023-09-30', 'Tecnologia', 89.99),
(7, 'Mochila Escolar', 'Mochila para estudantes', '2023-10-03', 'Acessórios', 34.99),
(18, 'Sapato Social', 'Sapato de couro para ocasiões formais', '2023-11-11', 'Moda', 69.99),
(22, 'Garrafa Térmica', 'Garrafa para líquidos quentes ou frios', '2023-12-14', 'Casa', 14.99),
(4, 'Jogo de Panelas', 'Conjunto de panelas antiaderentes', '2024-01-20', 'Casa', 79.99),
(11, 'Escova Elétrica', 'Escova de dentes elétrica', '2024-02-25', 'Saúde', 24.99),
(6, 'Teclado Mecânico', 'Teclado para jogos mecânico com LED', '2024-03-30', 'Tecnologia', 69.99);
