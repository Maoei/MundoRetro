<script setup>
import { ref, onMounted, reactive } from 'vue';

const cartoesData = reactive({
  name: '',
  cartoes: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCartoes();
});

async function getCartoes() {
  fetch('http://localhost:3001/getCartoes/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      cartoesData.cartoes = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <main>
    <h>Lista de Endereços</h>
    <div class="card-body">
      <li v-for="cartao in cartoesData.cartoes">
        {{ cartao.nomeCartao + '\n ' + endereco.numeroCartao }}
      </li>
      <RouterLink class="btn btn-primary" :to="'/cartoes/cadastro/' + id"
        >Cadastrar Novo Endereço</RouterLink
      >
    </div>
  </main>
</template>

<style></style>
