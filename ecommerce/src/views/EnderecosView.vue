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
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a :href="'/conta/' + id">Conta</a></li>
          <li class="breadcrumb-item active" aria-current="page">
            Lista de Endereços
          </li>
        </ol>
      </nav>
      <div class="row">
        <div class="col">
          <h1>Lista de Endereços</h1>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card mt-3" v-for="endereco in enderecoData.enderecos">
            <div class="card-body">
              {{
                'Endereço: ' +
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
              <RouterLink
                class="btn btn-secondary float-end"
                :to="'/enderecos/editar/' + endereco.id"
                >Editar Endereço</RouterLink
              >
            </div>
          </div>
          <div class="col mt-3">
            <RouterLink
              class="btn btn-secondary"
              :to="'/enderecos/cadastro/' + id"
              >Cadastrar Novo Endereço</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
