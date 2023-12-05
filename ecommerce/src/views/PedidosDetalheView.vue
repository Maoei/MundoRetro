<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const checkoutProdutosData = reactive({
  name: '',
  produtos: [],
  qtd: 0,
});

let id = '';
let exibir = false;
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  id = route.params.id;
  console.log('Id: ' + id);

  getPedidosDetalhe();
});

function getPedidosDetalhe() {
  fetch('http://localhost:3001/getPedidosDetalhe/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        checkoutProdutosData.qtd++;
      });
      console.log('Resposta do backend:', data);
      checkoutProdutosData.produtos = data;
      console.log('idCheckOutProduto ' + checkoutProdutosData.produtos.id);
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
    idCheckOutProduto: produto.id,
    idCliente: id,
    idProduto: produto.idProduto,
    status: status,
  };
  console.log('status ' + requestBody.status);
  console.log('idCheckOut ' + requestBody.idCheckOut);
  console.log('idCliente ' + requestBody.idCliente);
  console.log('idProduto ' + requestBody.idProduto);
  console.log('idCheckOutProduto ' + requestBody.idCheckOutProduto);

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
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a :href="'/conta/' + id">Conta</a></li>
          <li class="breadcrumb-item">
            <a :href="'/pedidos'">Detalhes do Pedido</a>
          </li>

          <li class="breadcrumb-item active" aria-current="page">
            Lista de Pedidos
          </li>
        </ol>
      </nav>

      <div class="row">
        <div class="col">
          <h2 class="text-center">Detalhes do Pedido</h2>
        </div>
      </div>

      <div class="row mt-2">
        <div
          class="col mt-2"
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
                {{ produto.titulo }}
              </h5>
              <p class="card-text">{{ produto.descrProduto }}</p>
              <p class="card-text">
                <strong>ID Pedido:</strong> {{ produto.idCheckOut }}
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
                  class="btn btn-warning mt-1"
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
