<script setup>
import { ref, onMounted, reactive } from 'vue';

const produtoData = reactive({
  name: '',
  produtos: [],
});

let exibir = false;

onMounted(async () => {
  console.log('onmounted ok');
  await getProdutos();
});

async function getProdutos() {
  fetch('http://localhost:3001/getProdutos', {
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
</script>

<template v-if="exibir">
  <main>
    <h>Produtos</h>
    <div class="card-body">
      <li v-for="produto in produtoData.produtos">
        <RouterLink :to="'/produtos/detalhe/' + produto.id">{{
          produto.titulo
        }}</RouterLink>
      </li>
    </div>
  </main>
</template>

<style></style>
