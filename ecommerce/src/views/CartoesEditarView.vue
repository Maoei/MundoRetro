<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const cartoesData = reactive({
  name: '',
  cartoes: [],
  idBandeira: '1',
});

let idCartao = '';
let exibir = false;
const route = useRoute();

onMounted(async () => {
  idCartao = route.params.id;
  console.log('idCartao ' + idCartao);

  await getCartoesId();
});

async function getCartoesId() {
  fetch('http://localhost:3001/getCartoesId/' + idCartao, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      cartoesData.cartoes = data;
      console.log('numeroCartao:', cartoesData.cartoes.numeroCartao);

      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

function submitForm() {
  //updateCartao({ ...cartoesData }); // Envia os dados do formulário para a função updateCartao
}

function definirBandeira() {
  cartoesData.idBandeira = cartoesData.numeroCartao.charAt(0);
  console.log('idBandeira ' + cartoesData.idBandeira);
}
</script>
<template v-if="exibir">
  <main>
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a :href="'/conta/' + id">Conta</a></li>
          <li class="breadcrumb-item">
            <a :href="'/cartoes'">Lista de Cartões</a>
          </li>

          <li class="breadcrumb-item active" aria-current="page">Edição</li>
        </ol>
      </nav>
      <div class="row">
        <div class="col">
          <h1>ID Cartão: {{ idCartao }}</h1>
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
                v-model="cartoesData.cartoes.numeroCartao"
                class="form-control"
                @input="definirBandeira()"
              />
            </div>
            <div class="col-md-7">
              <label for="nomeCartao">Nome no Cartão: </label>
              <input
                type="text"
                id="nomeCartao"
                v-model="cartoesData.cartoes.nomeCartao"
                class="form-control"
              />
            </div>
            <div class="row">
              <div class="col-md-3">
                <label for="validade">Validade: </label>
                <input
                  type="text"
                  id="validade"
                  v-model="cartoesData.cartoes.validade"
                  class="form-control"
                />
              </div>
              <div class="col-md-3">
                <label for="codigoSeguranca">Código de Segurança: </label>
                <input
                  type="text"
                  id="codigoSeguranca"
                  v-model="cartoesData.cartoes.codigoSeguranca"
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
            <div class="row mt-3">
              <div class="col">
                <button type="submit" class="btn btn-secondary">
                  Cadastrar Cartão
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
