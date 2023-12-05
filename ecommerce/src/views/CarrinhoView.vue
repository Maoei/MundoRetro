<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const carrinhoData = reactive({
  name: '',
  produtos: [],
  data: { qtd: 1 },
  valorTotal: 0.0,
});

let id = '';
let exibir = false;
const router = useRouter();

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCarrinho(); // Chama getCarrinho
});

async function getCarrinho() {
  fetch(`http://localhost:3001/getCarrinho/` + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      carrinhoData.produtos = data;
      carrinhoData.valorTotal = data.reduce((total, produto) => {
      return total + (produto.valor * produto.qtd);
      }, 0).toFixed(2);
      console.log('carrinhoData.valorTotal ' + carrinhoData.valorTotal);
   })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function deleteUmCarrinho(id) {
  // Remove o item do carrinho via API (necessário ajustar a chamada para enviar o ID correto)
  fetch(`http://localhost:3001/removeFromCarrinho/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clienteId: localStorage.id }),
  })
    .then((response) => response)
    .then((data) => {
      console.log('Resposta do backend:', data);
      getCarrinho(id);
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function updateCarrinho(id, qtd) {
  console.log(id, qtd);
}

async function addCarrinho(id, qtd) {
  carrinhoData.data.produtoId = id;
  carrinhoData.data.clienteId = localStorage.id;
  carrinhoData.data.qtd = qtd;

  console.log(carrinhoData.data);
  fetch('http://localhost:3001/add-to-cart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carrinhoData.data),
  })
    .then((response) => response)
    .then((data) => {
      console.log('Resposta do backend:', data);
      getCarrinho();
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

function redirect() {
  router.push('/checkout');
}
</script>

<template v-if="exibir">
  <main>
    <div class="container text-center">
      <div class="row">
        <div class="col">
          <h1>Carrinho</h1>
        </div>
      </div>
      <div class="row mt-2 ">
        <div class="col">
          <form>
            <div class="card-body">
              <div
                class="col"
                v-for="produto in carrinhoData.produtos"
                :key="produto.id"
              >
                <div class="card mb-3 mt-3 " style="max-width: 800px">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img
                        :src="
                          '../src/assets/images/' + produto.produto_id + '.png'
                        "
                        class="img-fluid rounded-start"
                        alt="..."
                      />
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">{{ produto.titulo }}</h5>
                        <p class="card-text">
                          {{ produto.descrProduto }}
                        </p>
                        <a
                    href="#"
                    class="btn btn-secondary mt-2 mb-2"
                    style="margin-right: 2px"
                    >R$ {{ (produto.valor * produto.qtd).toFixed(2) }}</a
                  >
                        <p class="card-text ">
                          <div class="mb-3 offset-md-4 col-md-4 justify-content-center">
                            <input
                              class="form-control "
                              type="number"
                              min="1"
                              :max="produto.produto_qtd"
                              v-model="produto.qtd"
                              v-on:change="
                                addCarrinho(produto.produto_id, produto.qtd)
                              "
                              
                            />
                            <button
                    class="btn btn-danger mt-2"
                    v-on:click="deleteUmCarrinho(produto.id)"
                  >
                    Excluir
                  </button>
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col mt-4">
          <button class="btn btn-secondary" v-on:click="redirect()">
            Ir para o pagamento
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
