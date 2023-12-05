<script setup>
import { ref, onMounted, reactive } from 'vue';

const userData = reactive({
  name: '',
  users: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getUsers();
});

async function getUsers() {
  await fetch('http://localhost:3001/getUsers', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      userData.users = data;
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
          <li class="breadcrumb-item"><a :href="'/admin'">Admin</a></li>

          <li class="breadcrumb-item active" aria-current="page">
            Lista de Usuários
          </li>
        </ol>
      </nav>
      <div class="row">
        <div class="col">
          <h1 class="text-center">Admin</h1>
          <h2 class="text-center">Lista de Usuários</h2>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card mt-2" v-for="user in userData.users">
            <div class="card-body" style="white-space: pre-line">
              {{
                'Usuário ID: ' +
                user.id +
                '\n' +
                `Nome do Usuário: ` +
                user.nome +
                ` E-mail: ` +
                user.email +
                ` CPF/CNPJ: ` +
                user.cpfcnpj +
                '\n' +
                ` Data Nascimento: ` +
                user.dtnascimento +
                ` Genero: ` +
                user.genero +
                ` Telefone: ` +
                user.telefone
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
