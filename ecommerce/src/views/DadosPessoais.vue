<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const clienteData = reactive({
  name: '',
  clientes: [],
});

let id = '';
let exibir = false;
const router = useRouter();

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getUserId();
});

async function getUserId() {
  fetch('http://localhost:3001/getUser/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      clienteData.clientes = data;
      console.log(
        'clienteData.clientes.dtnascimento ' + clienteData.clientes.dtnascimento
      );
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
          <h3>Meus Dados</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="nome">Nome: </label>
              <input
                type="text"
                id="nome"
                class="form-control"
                v-model="clienteData.clientes.nome"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="email">Email: </label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="clienteData.clientes.email"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="cpfcnpj">CPF/CNPJ: </label>
              <input
                type="text"
                id="cpfcnpj"
                class="form-control"
                v-model="clienteData.clientes.cpfcnpj"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="dtnascimento">Data de Nascimento: </label>
              <input
                type="date"
                id="dtnascimento"
                class="form-control"
                v-model="clienteData.clientes.dtnascimento"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="genero">Gênero: </label>
              <input
                type="text"
                id="genero"
                class="form-control"
                v-model="clienteData.clientes.genero"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="telefone">Telefone: </label>
              <input
                type="text"
                id="telefone"
                class="form-control"
                v-model="clienteData.clientes.telefone"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="usr">Usuário: </label>
              <input
                type="text"
                id="usr"
                class="form-control"
                v-model="clienteData.clientes.usr"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="senha">Senha: </label>
              <input
                type="password"
                id="senha"
                class="form-control"
                v-model="clienteData.clientes.senha"
                disabled
              />
            </div>

            <div class="col-12">
              <button class="btn btn-secondary">
                <RouterLink :to="'/dados-pessoais/editar'"
                  >Editar Dados</RouterLink
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
