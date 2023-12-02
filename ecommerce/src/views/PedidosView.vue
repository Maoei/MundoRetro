<script setup>
import { ref, onMounted, reactive } from 'vue';

const checkoutProdutosData = reactive({
  name: '',
  produtos: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCheckoutProdutosId();
});

async function getCheckoutProdutosId() {
  fetch('http://localhost:3001/getCheckoutProdutosId/' + id, {
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
    <h2 class="text-center">Lista de Compras</h2>
    <div class="container" style="background-color: bisque">
      <div class="row">
        <div
          class="col"
          v-for="produto in checkoutProdutosData.produtos"
          :key="produto.idCheckOut"
        >
          <div class="card" style="width: 18rem">
            <img src="..." class="card-img-top" alt="..." />
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
              <a href="#" class="btn btn-secondary" style="margin-right: 2px">{{
                produto.status
              }}</a>
              <div v-if="produto.status == 'ENTREGUE'">
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
