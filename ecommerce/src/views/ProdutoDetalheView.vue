<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

const produtoData = reactive({
  name: '',
  produtos: [],
  data: { qtd: 1 },
});

let id = '';
let exibir = false;
const route = useRoute();

onMounted(async () => {
  console.log(route.params.id);
  id = route.params.id;

  getProduto();
});

async function getProduto() {
  fetch('http://localhost:3001/getProduto/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      produtoData.produtos = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function addCarrinho(id) {
  produtoData.data.produtoId = id;
  produtoData.data.clienteId = localStorage.id;
  console.log(produtoData.data);
  fetch('http://localhost:3001/add-to-cart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produtoData.data),
  })
    .then((response) => response)
    .then((data) => {
      console.log('Resposta do backend:', data);
      getProduto();
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });

  //window.location.reload; = f5
}
</script>

<template>
  <main>
    <h>{{ produtoData.produtos.titulo }}</h>
    <div class="card-body">
      <li>
        <button v-on:click="addCarrinho(produtoData.produtos.id)">
          Comprar
        </button>
        <input
          type="number"
          :max="produtoData.produtos.qtd"
          v-model="produtoData.data.qtd"
        />
        Qtd
      </li>
    </div>
  </main>
</template>

<style></style>
