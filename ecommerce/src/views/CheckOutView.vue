<script setup>
import { ref, onMounted, reactive } from 'vue';

const carrinhoData = reactive({
  name: '',
  produtos: [],
  data: { qtd: 1 },
  valorTotal: 0.0,
});

const cartoesData = reactive({
  name: '',
  cartoes: [],
});

const enderecoData = reactive({
  name: '',
  enderecos: [],
});

const checkoutData = reactive({
  valorFinal: 0,
  idEndereco: '',
  idCliente: localStorage.id,
  idCartao1: '',
  idCartao2: '',
  valorCartao1: 0,
  valorCartao2: 0,
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCarrinho(); // Chama getCarrinho
  await getEnderecos();
  await getCartoes();
});

async function addCheckOut() {
  fetch(`http://localhost:3001/checkout/finalizar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkoutData),
  })
    .then((response) => response)
    .then((data) => {
      console.log('Resposta do backend:', data);
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function getCarrinho() {
  fetch(`http://localhost:3001/getCarrinho/` + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      carrinhoData.produtos = data;
      carrinhoData.produtos.forEach((item) => {
        carrinhoData.valorTotal += Number(item.valor) * Number(item.qtd);
        //console.log(value);
        console.log(item.valor);
        console.log(item.qtd);
      });
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function getEnderecos() {
  fetch('http://localhost:3001/getEnderecos/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      enderecoData.enderecos = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
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
</script>

<template v-if="exibir">
  <main>
    <h1>CheckOut</h1>
    <div class="card-body">
      <ul>
        <li v-for="produto in carrinhoData.produtos" :key="produto.id">
          <h2>{{ produto.titulo }}</h2>
          <input
            type="number"
            min="1"
            :max="produto.produto_qtd"
            v-model="produto.qtd"
            readonly
            v-on:change="addCarrinho(produto.produto_id, produto.qtd)"
          />
        </li>
      </ul>
    </div>
    <div>
      <h3>Valor Total</h3>
      <h2>{{ carrinhoData.valorTotal }}</h2>
    </div>
    <div>
      <h1>Selecione o Endereço</h1>
      <select name="" id="cartao" v-model="checkoutData.idEndereco">
        <option v-for="endereco in enderecoData.enderecos" :value="endereco.id">
          {{ endereco.endereco }}
        </option>
      </select>
    </div>
    <div>
      <h1>Selecione o Método de Pagamento</h1>
      <h2>Escolha o Cartão 1</h2>
      <select name="" id="cartao1" v-model="checkoutData.idCartao1">
        <option v-for="cartao in cartoesData.cartoes" :value="cartao.id">
          {{ cartao.numeroCartao }}
        </option>
      </select>
      <h2>Valor a Pagar no Cartão 1</h2>
      <input
        type="number"
        v-model="checkoutData.valorCartao1"
        min="0"
        :max="carrinhoData.valorTotal"
      />

      <div>
        <h2>Escolha o Cartão 2</h2>
        <select name="" id="cartao2" v-model="checkoutData.idCartao2">
          <option v-for="cartao in cartoesData.cartoes" :value="cartao.id">
            {{ cartao.numeroCartao }}
          </option>
        </select>
        <h2>Valor a Pagar no Cartão 2</h2>
        <input
          type="number"
          v-model="checkoutData.valorCartao2"
          :min="0"
          :max="carrinhoData.valorTotal - checkoutData.valorCartao1"
        />
      </div>
    </div>
    <button v-on:click="addCheckOut()">Finalizar</button>
  </main>
</template>
