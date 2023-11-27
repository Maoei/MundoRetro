<script setup>
import { ref, onMounted, reactive } from 'vue';

const produtoData = reactive({
  name: '',
  produtos: [],
});

let exibir = false;

onMounted(async () => {
  console.log('onmounted ok');
  await getProdutos();
});

async function getProdutos() {
  fetch('http://localhost:3001/getProdutos', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      produtoData.produtos = data;
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
          <h1 class="text-center">Produtos</h1>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col" v-for="produto in produtoData.produtos">
          <div class="card" style="width: 18rem">
            <img
              :src="'../../src/assets/images/' + produto.id + '.png'"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">
                <RouterLink :to="'/produtos/detalhe/' + produto.id">{{
                  produto.titulo
                }}</RouterLink>
              </h5>
              <p class="card-text">{{ produto.descrProduto }}</p>
              <a href="#" class="btn btn-secondary" style="margin-right: 2px"
                >R$ {{ produto.valor }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
