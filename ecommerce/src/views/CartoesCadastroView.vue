<script setup>
import { ref, onMounted, reactive } from 'vue';

const cartoesData = reactive({
  name: '',
  cartoes: [],
  idBandeira: '1',
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
  //cartoesData.validade = cartoesData.validade.slice(2);
  addCartao({ ...cartoesData }); // Envia os dados do formulário para a função addCartao
}

function definirBandeira() {
  cartoesData.idBandeira = cartoesData.numeroCartao.charAt(0);
  console.log('idBandeira ' + cartoesData.idBandeira);
}
</script>
<template v-if="exibir">
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Cadastro de Cartões</h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form class="row g-3" @submit.prevent="submitForm">
            <div class="col-md-7">
              <label for="numeroCartao">Número do Cartão: </label>
              <input
                type="text"
                id="numeroCartao"
                maxlength="16"
                v-model="cartoesData.numeroCartao"
                @input="definirBandeira()"
                class="form-control"
              />
            </div>
            <div class="col-md-7">
              <label for="nomeCartao">Nome no Cartão: </label>
              <input
                type="text"
                id="nomeCartao"
                v-model="cartoesData.nomeCartao"
                class="form-control"
              />
            </div>
            <div class="row">
              <div class="col-md-3">
                <label for="validade">Validade: </label>
                <input
                  type="text"
                  id="validade"
                  v-model="cartoesData.validade"
                  class="form-control"
                />
              </div>
              <div class="col-md-3">
                <label for="codigoSeguranca">Código de Segurança: </label>
                <input
                  type="text"
                  id="codigoSeguranca"
                  maxlength="3"
                  v-model="cartoesData.codigoSeguranca"
                  class="form-control"
                />
              </div>
              <div class="float-end me-2 mt-3">
                <img
                  :src="
                    '../../src/assets/images/cartoes/' +
                    cartoesData.idBandeira +
                    '.png'
                  "
                  height="30"
                  width="30"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <RouterLink class="btn btn-secondary" :to="'/cartoes'"
                  >Cadastrar Cartão</RouterLink
                >
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
