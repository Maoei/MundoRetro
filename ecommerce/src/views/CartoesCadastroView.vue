<script setup>
import { ref, onMounted, reactive } from 'vue';

const cartoesData = reactive({
  name: '',
  cartoes: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);
  getCartoes();
});

async function getCartoes() {
  fetch('http://localhost:3001/getCartoes/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      cartoesData.cartoes = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
async function addCartao(data) {
  try {
    const response = await fetch(`http://localhost:3001/addCartao/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
      cartoesData.cartoes = responseData;
      getCartoes();
    } else {
      throw new Error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

function submitForm() {
  addCartao({ ...cartoesData }); // Envia os dados do formulário para a função addCartao
}
</script>

<template v-if="exibir">
  <main>
    <h1>Cadastro de Cartões</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="numeroCartao">Número do Cartão: </label>
        <input
          type="text"
          id="numeroCartao"
          v-model="cartoesData.numeroCartao"
        />
      </div>
      <div>
        <label for="nomeCartao">Nome no Cartão: </label>
        <input type="text" id="nomeCartao" v-model="cartoesData.nomeCartao" />
      </div>
      <div>
        <label for="validade">Validade: </label>
        <input type="date" id="validade" v-model="cartoesData.validade" />
      </div>
      <div>
        <label for="codigoSeguranca">Código de Segurança: </label>
        <input
          type="text"
          id="codigoSeguranca"
          v-model="cartoesData.codigoSeguranca"
        />
      </div>
      <button type="submit">Cadastrar Cartão</button>
    </form>
  </main>
</template>

<style></style>
