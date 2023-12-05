<script setup>
import { ref, onMounted, reactive } from 'vue';

const produtoData = reactive({
  name: '',
  produtos: [],
  generoFiltro: 'Todos',
});

let exibir = false;

onMounted(async () => {
  console.log('onmounted ok');
  await getProdutos();
});

async function getProdutos() {
  let genero = produtoData.generoFiltro;

  fetch('http://localhost:3001/getProdutos/' + genero, {
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
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a :href="'/admin'">Admin</a></li>

          <li class="breadcrumb-item active" aria-current="page">
            Lista de Produtos
          </li>
        </ol>
      </nav>
      <div class="row">
        <div class="col">
          <h1 class="text-center">Admin</h1>
          <h2 class="text-center">Lista de Produtos</h2>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <form class="d-flex" role="search">
            <select
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              v-model="produtoData.generoFiltro"
              v-on:change="getProdutos()"
            >
              <option value="Todos">Todos</option>
              <option value="Plataforma">Plataforma</option>
              <option value="Aventura">Aventura</option>
              <option value="Ação">Ação</option>
              <option value="Labirinto">Labirinto</option>
              <option value="Luta">Luta</option>
              <option value="Quebra-cabeça">Quebra-cabeça</option>
            </select>
          </form>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col mt-2" v-for="produto in produtoData.produtos">
          <div class="card" style="width: 18rem; height: 30rem">
            <img
              :src="'../../src/assets/images/' + produto.id + '.png'"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">
                {{ produto.titulo }}
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
