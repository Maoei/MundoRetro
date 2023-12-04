<script setup>
import { ref, onMounted, reactive } from 'vue';

const checkoutProdutosData = reactive({
  name: '',
  produtos: [],
  statusPedidos: 'TODOS',
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCheckoutProdutos();
});

async function getCheckoutProdutos() {
  let status = checkoutProdutosData.statusPedidos;
  fetch('http://localhost:3001/getCheckoutProdutos/' + status, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      checkoutProdutosData.produtos = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="text-center">Admin</h1>
          <h2 class="text-center">Lista de Vendas</h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form class="d-flex" role="search">
            <select
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              v-model="checkoutProdutosData.statusPedidos"
              v-on:change="getCheckoutProdutos()"
            >
              <option value="TODOS">TODOS</option>
              <option value="EM PROCESSAMENTO">EM PROCESSAMENTO</option>
              <option value="PEDIDO APROVADO">PEDIDO APROVADO</option>
              <option value="PAGAMENTO RECUSADO">PAGAMENTO RECUSADO</option>
              <option value="EM TRÂNSITO">EM TRÂNSITO</option>
              <option value="ENTREGUE">ENTREGUE</option>
              <option value="TROCA SOLICITADA">TROCA SOLICITADA</option>
              <option value="TROCA APROVADA">TROCA APROVADA</option>
              <option value="TROCA REALIZADA">TROCA REALIZADA</option>
              <option value="TROCA RECUSADA">TROCA RECUSADA</option>
            </select>
          </form>
        </div>
      </div>
      <div class="row">
        <div
          class="col"
          v-for="produto in checkoutProdutosData.produtos"
          :key="produto.idCheckOut"
        >
          <div class="card" style="width: 18rem; height: 40rem">
            <img
              :src="'../../src/assets/images/' + produto.idProduto + '.png'"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">
                <RouterLink :to="'/admin/pedidos/' + produto.idCheckOut">{{
                  produto.titulo
                }}</RouterLink>
              </h5>
              <p class="card-text">{{ produto.descrProduto }}</p>
              <p class="card-text">
                <strong>ID Checkout:</strong> {{ produto.idCheckOut }}
              </p>
              <p class="card-text">
                <strong>ID Produto:</strong> {{ produto.idProduto }}
              </p>
              <p class="card-text">
                <strong>Valor:</strong> {{ produto.valorProduto }}
              </p>
              <p class="card-text">
                <strong>Gênero:</strong> {{ produto.genero }}
              </p>
              <a href="#" class="btn btn-secondary" style="margin-right: 2px">{{
                produto.status
              }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
