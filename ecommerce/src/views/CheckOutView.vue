<script setup>
import { ref, onMounted, reactive } from 'vue';

const carrinhoData = reactive({
  name: '',
  produtos: [],
  data: { qtd: 1 },
});

let id = '';
let exibir = false;

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
      exibir = true;
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
</script>

<template v-if="exibir">
  <main>
    <h1>Carrinho</h1>
    <div class="card-body">
      <ul>
        <li v-for="produto in carrinhoData.produtos" :key="produto.id">
          <h2>{{ produto.titulo }}</h2>
          <input
            type="number"
            min="1"
            :max="produto.produto_qtd"
            v-model="produto.qtd"
            v-on:change="addCarrinho(produto.produto_id, produto.qtd)"
          />
          <button v-on:click="deleteUmCarrinho(produto.id)">Excluir</button>
        </li>
      </ul>
    </div>
  </main>
</template>
