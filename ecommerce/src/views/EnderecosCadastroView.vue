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
async function addEndereco() {
  fetch('http://localhost:3001/addEndereco/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      enderecoData.enderecos = data;
      exibir = true;
      getEnderecos();
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <main>
    <h>Cadastro de Endereço</h>
    <div class="card-body"></div>
  </main>
</template>

<style></style>
