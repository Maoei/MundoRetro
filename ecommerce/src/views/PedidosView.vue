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

  await getCheckoutProdutosId();
});

async function getCheckoutProdutosId() {
  let status = checkoutProdutosData.statusPedidos;
  fetch('http://localhost:3001/getCheckoutProdutosId/' + id + '/' + status, {
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
function trocaSolicitada(produto) {
  console.log('produto ' + produto);
  let status = 'TROCA SOLICITADA';

  const requestBody = {
    idCheckOut: produto.idCheckOut,
    idCliente: id,
    idProduto: produto.idProduto,
    status: status,
  };
  console.log('status ' + requestBody.status);
  console.log('idCheckOut ' + requestBody.idCheckOut);
  console.log('idCliente ' + requestBody.idCliente);
  console.log('idProduto ' + requestBody.idProduto);

  fetch(`http://localhost:3001/trocaSolicitada`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
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
          <h2 class="text-center">Lista de Compras</h2>
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
              v-on:change="getCheckoutProdutosId()"
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
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <div class="row mt-2">
        <div
          class="col mt-2"
          v-for="produto in checkoutProdutosData.produtos"
          :key="produto.idCheckOut"
        >
          <div class="card" style="width: 18rem">
            <img
              :src="'../../src/assets/images/' + produto.idProduto + '.png'"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">
                {{ produto.titulo }}
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
              <div class="col">
                <a
                  href="#"
                  class="btn btn-secondary"
                  style="margin-right: 2px"
                  >{{ produto.status }}</a
                >
              </div>
              <div class="cols" v-if="produto.status == 'ENTREGUE'">
                <a
                  href="#"
                  class="btn btn-secondary"
                  style="margin-right: 2px"
                  @click="trocaSolicitada(produto)"
                  >Solicitar Troca</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
