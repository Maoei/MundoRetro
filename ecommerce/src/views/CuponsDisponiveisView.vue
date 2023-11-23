<script setup>
import { ref, onMounted, reactive } from 'vue';

const cuponsData = reactive({
  name: '',
  cupons: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCupons();
});

async function getCupons() {
  fetch('http://localhost:3001/getCuponsDisponiveis/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      cuponsData.cupons = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <main>
    <h3>Lista de Cupons</h3>
    <div class="card-body">
      <li v-for="cupom in cuponsData.cupons">
        {{ cupom.codigoCupon + ': ' + cupom.descrCupom }}
      </li>
    </div>
  </main>
</template>

<style></style>
