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

<template>
  <main>
    <div class="container" style="background-color: bisque">
      <div class="row">
        <div class="col" v-for="produto in produtoData.produtos">
          <div class="card" style="width: 18rem">
            <img
              :src="'../src/assets/images/' + produto.id + '.png'"
              class="card-img-top image-fluid"
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
              <a href="#" class="btn btn-primary">Adicionar ao carrinho</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card" style="width: 18rem">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" class="btn btn-secondary" style="margin-right: 2px"
                >R$ 123.99</a
              >
              <a href="#" class="btn btn-primary">Comprar</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card" style="width: 18rem">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <h1>Teste</h1>
      </div>
    </div>
  </main>
</template>
