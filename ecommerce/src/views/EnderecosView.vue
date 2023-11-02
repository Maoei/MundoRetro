<script setup>
import { ref, onMounted, reactive } from 'vue';

const enderecoData = reactive({
  name: '',
  enderecos: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getEnderecos();
});

async function getEnderecos() {
  fetch('http://localhost:3001/getEnderecos/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      enderecoData.enderecos = data;
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
      <li v-for="endereco in enderecoData.enderecos">
        {{
          endereco.cep +
          ', ' +
          endereco.endereco +
          ', ' +
          endereco.numero +
          ', ' +
          endereco.complemento +
          ', ' +
          endereco.bairro +
          ' - ' +
          endereco.cidade +
          ', ' +
          endereco.estado
        }}
      </li>
      <RouterLink class="btn btn-primary" :to="'/enderecos/cadastro/' + id"
        >Cadastrar Novo Endereço</RouterLink
      >
    </div>
  </main>
</template>

<style></style>
