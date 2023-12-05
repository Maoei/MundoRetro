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

function submitForm() {
  updateUser({ ...clienteData }); // Envia os dados do formulário para a função updateUser
}

async function updateUser(data) {
  console.log('updateUser');
  try {
    const response = await fetch(`http://localhost:3001/updateUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
      clienteData.clientes = responseData;
      getUserId();
      router.push('/dados-pessoais');
    } else {
      throw new Error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}
</script>

<template v-if="exibir">
  <main>
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a :href="'/conta/' + id">Conta</a></li>
          <li class="breadcrumb-item">
            <a :href="'/dados-pessoais'">Dados Pessoais</a>
          </li>

          <li class="breadcrumb-item active" aria-current="page">Edição</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col">
          <h3>Meus Dados</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form class="row g-3" @submit.prevent="submitForm">
            <div class="col-md-6">
              <label for="nome">Nome: </label>
              <input
                type="text"
                id="nome"
                class="form-control"
                v-model="clienteData.clientes.nome"
              />
            </div>
            <div class="col-md-6">
              <label for="email">Email: </label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="clienteData.clientes.email"
              />
            </div>
            <div class="col-md-6">
              <label for="cpfcnpj">CPF/CNPJ: </label>
              <input
                type="text"
                id="cpfcnpj"
                class="form-control"
                v-model="clienteData.clientes.cpfcnpj"
              />
            </div>
            <div class="col-md-6">
              <label for="dtnascimento">Data de Nascimento: </label>
              <input
                type="date"
                id="dtnascimento"
                class="form-control"
                v-model="clienteData.clientes.dtnascimento"
              />
            </div>
            <div class="col-md-6">
              <label for="genero">Gênero: </label>
              <input
                type="text"
                id="genero"
                class="form-control"
                v-model="clienteData.clientes.genero"
              />
            </div>
            <div class="col-md-6">
              <label for="telefone">Telefone: </label>
              <input
                type="text"
                id="telefone"
                class="form-control"
                v-model="clienteData.clientes.telefone"
              />
            </div>
            <div class="col-md-6">
              <label for="usr">Usuário: </label>
              <input
                type="text"
                id="usr"
                class="form-control"
                v-model="clienteData.clientes.usr"
              />
            </div>
            <div class="col-md-6">
              <label for="senha">Senha: </label>
              <input
                type="text"
                id="senha"
                class="form-control"
                v-model="clienteData.clientes.senha"
              />
            </div>

            <div class="col-12">
              <button class="btn btn-secondary" type="submit">
                <RouterLink :to="'/dados-pessoais'">Cancelar</RouterLink>
              </button>
              <button type="submit" class="btn btn-secondary">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
