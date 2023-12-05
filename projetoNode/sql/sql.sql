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

CREATE TABLE checkout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valorFinal DECIMAL(10, 2) NOT NULL,
	idCliente INT NOT NULL,
	idEndereco INT NOT NULL,
    status VARCHAR(20) NOT NULL,
	FOREIGN KEY (idEndereco) REFERENCES enderecos(id),
    FOREIGN KEY (idCliente) REFERENCES clientes(id)
    ALTER TABLE checkout ADD COLUMN valorPago DECIMAL(10, 2)
    ALTER TABLE checkout ADD COLUMN valorDesconto DECIMAL(10, 2)
    ALTER TABLE checkout ADD COLUMN valorFrete DECIMAL(10, 2)
    ALTER TABLE checkout ADD COLUMN observacao VARCHAR(300)
    ALTER TABLE checkout ADD COLUMN idEnderecoCobranca INT

);

CREATE TABLE checkoutPagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProduto INT NOT NULL,
	idCheckOut INT NOT NULL,
	idEndereco INT,
    valorProduto DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
	idCartao INT,
    numeroCartao VARCHAR(20),
    valorCartao DECIMAL(10, 2) NOT NULL,
    ALTER TABLE checkoutPagamentos ADD COLUMN dtCompra DATE DEFAULT '2023-12-01',
	FOREIGN KEY (idEndereco) REFERENCES enderecos(id) ON DELETE SET NULL,
	FOREIGN KEY (idCartao) REFERENCES cartoes(id) ON DELETE SET NULL,
	FOREIGN KEY (idProduto) REFERENCES produtos(id),
	FOREIGN KEY (idCheckOut) REFERENCES checkout(id) 
);

CREATE TABLE checkoutProdutos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProduto INT NOT NULL,
	idCheckOut INT NOT NULL,
    valorProduto DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
	FOREIGN KEY (idProduto) REFERENCES produtos(id),
	FOREIGN KEY (idCheckOut) REFERENCES checkout(id) 
    ALTER TABLE checkoutProdutos ADD COLUMN qtd INT
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

INSERT INTO produtos (qtd, titulo, descrProduto, dtCompra, genero, valor) VALUES 
(5, 'Super Mario Bros', 'Jogo clássico do Mario para NES', '1990-05-18', 'Plataforma', 129.99),
(12, 'The Legend of Zelda', 'Aventura épica para NES', '1987-08-22', 'Aventura', 39.99),
(22, 'Sonic the Hedgehog', 'Ação rápida para Sega Genesis', '1991-06-23', 'Ação', 24.99),
(8, 'Metroid', 'Ação-aventura para NES', '1986-08-06', 'Ação/Aventura', 34.99),
(14, 'Donkey Kong Country', 'Aventura de plataforma para SNES', '1994-11-21', 'Plataforma', 99.99),
(37, 'Mega Man 2', 'Ação desafiante para NES', '1989-06-08', 'Ação', 59.99),
(9, 'Pac-Man', 'Clássico labirinto para Atari', '1982-03-15', 'Labirinto', 14.99),
(8, 'Street Fighter II', 'Luta intensa para SNES', '1992-02-06', 'Luta', 29.99),
(15, 'Tetris', 'Viciante quebra-cabeça para Game Boy', '1989-07-31', 'Quebra-cabeça', 39.99),
(4, 'Castlevania', 'Ação sombria para NES', '1986-09-26', 'Ação', 39.99);


INSERT INTO enderecos (cep, endereco, numero, complemento, bairro, cidade, estado, idCliente) VALUES
('12345-678', 'Rua Exemplo 1', 10, 'APTO 101', 'Centro', 'Cidade A', 'UF', 1),
('54321-876', 'Rua Teste 2', 20, NULL, 'Bairro Teste', 'Cidade B', 'UF', 2),
('11111-222', 'Rua dos Testes', 30, 'Casa 2', 'Centro', 'Cidade A', 'UF', 3),
('44444-555', 'Avenida Principal', 40, 'Sala 3', 'Bairro Legal', 'Cidade C', 'UF', 4),
('77777-888', 'Praça da Amizade', 50, NULL, 'Bairro Feliz', 'Cidade D', 'UF', 5),
('99999-000', 'Rua Nova', 60, 'Loja 5', 'Bairro Novo', 'Cidade E', 'UF', 1),
('22222-333', 'Avenida Central', 70, NULL, 'Bairro Central', 'Cidade A', 'UF', 2),
('66666-777', 'Travessa da Paz', 80, 'Casa 8', 'Bairro Tranquilo', 'Cidade B', 'UF', 3),
('88888-999', 'Rua da Colina', 90, NULL, 'Bairro Alto', 'Cidade C', 'UF', 4),
('33333-444', 'Alameda das Flores', 100, 'Apartamento 10', 'Bairro das Flores', 'Cidade D', 'UF', 5);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('1234567890123456', 'João Silva', '12/25', 123, 1);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('9876543210987654', 'Maria Souza', '09/24', 456, 2);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('1111222233334444', 'Pedro Oliveira', '03/23', 789, 3);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('5555666677778888', 'Ana Santos', '08/26', 246, 4);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('9999888877776666', 'Mariana Pereira', '11/27', 135, 5);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('3333222211110000', 'Rafaela Carvalho', '06/25', 579, 1);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('4444333322221111', 'Carlos Mendes', '02/23', 852, 2);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('7777666655554444', 'Fernanda Rocha', '07/24', 963, 3);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('8888999911112222', 'Gustavo Fernandes', '04/23', 741, 4);

INSERT INTO cartoes (numeroCartao, nomeCartao, validade, codigoSeguranca, idCliente) 
VALUES ('6666555544443333', 'Larissa Gomes', '10/26', 258, 5);

INSERT INTO cupons (codigoCupon, tipoCupom, descrCupom, dtValidade, valor, idCliente) VALUES
('10OFF', 'Desconto', '10 reais de desconto', '2023-11-20', 10.00, 4 ) 