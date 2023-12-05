<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const produtoData = reactive({
  name: '',
  produtos: [],
  data: { qtd: 1 },
});

let id = '';
let exibir = false;
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  console.log(route.params.id);
  id = route.params.id;

  getProduto();
});

async function getProduto() {
  fetch('http://localhost:3001/getProduto/' + id, {
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

async function addCarrinho(id) {
  produtoData.data.produtoId = id;
  produtoData.data.clienteId = localStorage.id;
  console.log(produtoData.data);
  fetch('http://localhost:3001/add-to-cart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produtoData.data),
  })
    .then((response) => response)
    .then((data) => {
      console.log('Resposta do backend:', data);
      getProduto();
      router.push('/carrinho');
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });

  //window.location.reload; = f5
}
</script>

<template>
  <main>
    <div class="container text-center">
      <div class="card mb-3" style="max-width: 1200px">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              :src="
                '../../src/assets/images/' + produtoData.produtos.id + '.png'
              "
              class="img-fluid rounded-start"
              alt="..."
              width="340"
              height="340"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ produtoData.produtos.titulo }}</h5>
              <p class="card-text">
                {{ produtoData.produtos.descrProduto }}
              </p>
              <div class="row justify-content-md-center">
                <div class="col">
                  <form>
                    <a
                      href="#"
                      class="btn btn-secondary mt-2 mb-2"
                      style="margin-right: 2px"
                      >R$ {{ produtoData.produtos.valor }}</a
                    >
                    <div class="mb-3 offset-md-4 col-md-4">
                      Qtd
                      <input
                        class="form-control"
                        type="number"
                        min="1"
                        :max="produtoData.produtos.qtd"
                        v-model="produtoData.data.qtd"
                      />
                    </div>
                  </form>
                  <div class="col mt-2">
                    <button
                      class="btn btn-success"
                      v-on:click="addCarrinho(produtoData.produtos.id)"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
