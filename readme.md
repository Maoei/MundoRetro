Fase 1:

CRUD de usuarios e produtos

Fase 2:

Fluxo de vendas

Fase 3:

Trocas e devoluções

Instruções:
Deverá ser apresentado o caso de uso de condução completo, onde um cliente poderá realizar a compra de um ou vários produtos diferentes, podendo selecionar a quantidade de cada produto ao adicioná-lo no carrinho ou editar essa quantidade no carrinho antes da finalização da compra.

Deverá ser possível realizar o pagamento com um ou mais cartões de crédito, combinado com diversos cupons de troca e UM cupom promocional.

É importante que a regra de valor mínimo por cartão de crédito seja considerada. Um cartão previamente cadastrado poderá ser escolhido para o pagamento, ou um novo cartão poderá ser adicionado.

O sistema deverá calcular o valor do frete com base no endereço de entrega. Tal endereço poderá ser selecionado ao fechar o pedido a partir de endereços previamente cadastrados, ou um novo endereço de entrega poderá ser cadastrado no ato da compra.

Após finalizar a compra, o sistema deverá gerar um número de pedido, e este deve ser apresentado ao cliente.

Abaixo, a lista de STATUS possíveis para um pedido:
EM PROCESSAMENTO;
PEDIDO APROVADO;
PAGAMENTO RECUSADO;
EM TRÂNSITO;
ENTREGUE;
TROCA SOLICITADA;
TROCA APROVADA;
TROCA REALIZADA;
TROCA RECUSADA.

Quando um pedido estiver com STATUS ENTREGUE, o cliente poderá solicitar a troca do pedido inteiro ou de um único item de um produto. Quem altera o status do pedido é o administrador.

Um pedido com TROCA SOLICITADA poderá ter sua troca aprovada pelo administrador. Quando o status for esse, o cliente enviará o produto a ser trocado para a loja, e o administrador, ao receber e verificar que o produto está de acordo, irá mudar o STATUS PARA TROCA REALIZADA, e com isso, um cupom de troca no valor do(s) item(ns) trocado(s) será disponibilizado para o cliente, que poderá utilizá-lo em uma próxima compra.

O cliente pode verificar o status atualizado do seu pedido a qualquer momento.

No caso da troca recusada, o administrador deve informar o motivo da recusa.

Parte do ADMIN por enquanto deve focar mais em trocar as situações do pedido.

Fazer tela com gráfico.

Adicionar botão para cadastro de cartão e endereço no checkout.

Ajustar para ter várias linhas o gráfico e adicionar o filtro por data de compra.

Adicionar um filtro na tela de pedidos e de admin.

Ajustar tamanho do gráfico na tela.

Revisar documentação e ppt.

TESTES AUTOMATIZADOS.

Deverá ser apresentado em sala de aula, o caso de uso de análise implementado. É esperado um gráfico de linhas que contenha as vendas de produtos ou categorias de produtos, onde cada linha representa um destes dois elementos. O usuário poderá definir uma data de início e uma data de fim e o gráfico no eixo x deverá ter o período selecionado pelo usuário e no eixo y o volume financeiro.

Cada linha deverá representar um produto ou uma categoria diferente.
