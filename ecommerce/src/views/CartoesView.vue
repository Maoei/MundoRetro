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

  await getCartoes();
});

async function getCartoes() {
  fetch('http://localhost:3001/getCartoes/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      cartoesData.cartoes = data;
      console.log('idCartao ', cartoesData.cartoes.id);
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
          <h1>Lista de Cartões</h1>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card" v-for="cartao in cartoesData.cartoes">
            <div
              class="card-body d-flex align-items-center"
              style="white-space: pre-line"
            >
              <div class="float-start me-2">
                <img
                  :src="
                    '../../src/assets/images/cartoes/' +
                    cartao.numeroCartao.charAt(0) +
                    '.png'
                  "
                  height="30"
                  width="30"
                />
              </div>
              {{
                'Nome do titular: ' +
                cartao.nomeCartao +
                '\n' +
                `Número do Cartão: ` +
                cartao.numeroCartao
              }}
              <div class="col">
                <RouterLink
                  class="btn btn-secondary float-end"
                  :to="'/cartoes/editar/' + cartao.id"
                  >Editar Cartão</RouterLink
                >
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col mt-3">
              <RouterLink
                class="btn btn-secondary"
                :to="'/cartoes/cadastro/' + id"
                >Cadastrar Novo Cartão</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
