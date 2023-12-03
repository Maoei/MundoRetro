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
  fetch('http://localhost:3001/getCuponsExpirados/' + id, {
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
    <div class="container">
      <div class="row">
        <div class="col">
          <h3>Lista de Cupons</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card" v-for="cupom in cuponsData.cupons">
            <div class="card-body" style="white-space: pre-line">
              {{ cupom.codigoCupon + ': ' + cupom.descrCupom }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
