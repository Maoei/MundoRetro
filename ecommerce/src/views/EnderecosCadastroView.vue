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
  getEnderecos();
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
async function addEndereco(data) {
  try {
    const response = await fetch(`http://localhost:3001/addEndereco/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
      enderecoData.enderecos = responseData;
      getEnderecos();
    } else {
      throw new Error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

function submitForm() {
  addEndereco({ ...enderecoData }); // Envia os dados do formulário para a função addEndereco
}
</script>

<template v-if="exibir">
  <main>
    <h1>Cadastro de Endereços</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="cep">CEP: </label>
        <input type="text" id="cep" v-model="enderecoData.cep" />
      </div>
      <div>
        <label for="endereco">Endereço: </label>
        <input type="text" id="endereco" v-model="enderecoData.endereco" />
      </div>
      <div>
        <label for="numero">Número: </label>
        <input type="text" id="numero" v-model="enderecoData.numero" />
      </div>
      <div>
        <label for="complemento">Complemento: </label>
        <input
          type="text"
          id="complemento"
          v-model="enderecoData.complemento"
        />
      </div>
      <div>
        <label for="bairro">Bairro: </label>
        <input type="text" id="bairro" v-model="enderecoData.bairro" />
      </div>
      <div>
        <label for="cidade">Cidade: </label>
        <input type="text" id="cidade" v-model="enderecoData.cidade" />
      </div>
      <div>
        <label for="estado">Estado: </label>
        <input type="text" id="estado" v-model="enderecoData.estado" />
      </div>
      <button type="submit">Cadastrar Endereço</button>
    </form>
  </main>
</template>

<style></style>
