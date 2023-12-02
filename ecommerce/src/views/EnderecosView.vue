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
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Lista de Endereços</h1>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card" v-for="endereco in enderecoData.enderecos">
            <div class="card-body" style="white-space: pre-line">
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
            </div>
          </div>
          <div class="row">
            <div class="col">
              <RouterLink
                class="btn btn-primary"
                :to="'/enderecos/cadastro/' + id"
                >Cadastrar Novo Endereço</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
