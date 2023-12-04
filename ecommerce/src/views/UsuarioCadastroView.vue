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
  getUsers();
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

async function addUsuario(data) {
  try {
    const response = await fetch(`http://localhost:3001/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
      userData.users = responseData;
      getUsers();
    } else {
      throw new Error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

function submitForm() {
  addUsuario({ ...userData }); // Envia os dados do formulário para a função addEndereco
}

function mascararCPFCNPJ(value) {
  // Remove qualquer caracter que não seja número
  value = value.replace(/\D/g, '');

  if (value.length > 11) {
    // Se o tamanho for maior que 11 (considerando um CNPJ), aplica a máscara de CNPJ
    value = value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
      '$1.$2.$3/$4-$5'
    );
  } else {
    // Aplica a máscara de CPF
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
  }

  return value;
}
</script>
<template v-if="exibir">
  <main>
    <h1>Cadastro de Usuários</h1>
    <form @submit.prevent="submitForm">
      <div class="row">
        <div class="col">
          <label for="nome">Nome: </label>
          <input
            type="text"
            id="nome"
            v-model="userData.nome"
            class="form-control"
          />
        </div>
        <div class="col">
          <label for="email">Email: </label>
          <input
            type="text"
            id="email"
            v-model="userData.email"
            class="form-control"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="cpfcnpj">CPF/CNPJ: </label>
          <input
            type="text"
            id="cpfcnpj"
            v-model="userData.cpfcnpj"
            @input="userData.cpfcnpj = mascararCPFCNPJ(userData.cpfcnpj)"
            class="form-control"
          />
        </div>
        <div class="col">
          <label for="dtnascimento">Data de Nascimento: </label>
          <input
            type="date"
            id="dtnascimento"
            v-model="userData.dtnascimento"
            class="form-control"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="genero">Gênero: </label>
          <select
            class="form-select"
            aria-label="Default select example"
            name=""
            id="genero"
            v-model="userData.genero"
          >
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <div class="col">
          <label for="telefone">Telefone: </label>
          <input
            type="text"
            id="telefone"
            v-model="userData.telefone"
            class="form-control"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="usr">Usuário: </label>
          <input
            type="text"
            id="usr"
            v-model="userData.usr"
            class="form-control"
          />
        </div>
        <div class="col">
          <label for="senha">Senha: </label>
          <input
            type="password"
            id="senha"
            v-model="userData.senha"
            class="form-control"
          />
        </div>
      </div>

      <div class="row mt-3">
        <div class="col">
          <button type="submit" class="btn btn-secondary">
            Cadastrar Usuário
          </button>
        </div>
      </div>
    </form>
  </main>
</template>
