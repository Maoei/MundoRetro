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
  idProduto: '',
  numeroCartao: '',
  valorProduto: 0,
  cartoes: [{}],
  qtdCartoes: 0,
  cupom: '',
  valorDesconto: 0,
  valorPago: 0,
  valorFrete: 0,
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
  console.log('checkoutData.cartoes ' + checkoutData.cartoes);
  let checkTotal = 0;
  const pagamentosArray = []; // Create an array to hold the pagamentos objects
  console.log('cartoesData.cartoes: ' + cartoesData.cartoes);
  console.log('carrinhoData.produtos: ' + carrinhoData.produtos);

  checkoutData.cartoes.forEach((value, index) => {
    checkTotal += value.valor;
    console.log('value ' + value.id.numeroCartao);

    carrinhoData.produtos.forEach((item) => {
      console.log('item ' + item.produto_id);
      const pagamentoObj = {
        idProduto: item.produto_id,
        idCartao: value.id.id,
        valorCartao: value.valor,
        numeroCartao: value.id.numeroCartao,
        valorProduto: item.valor,
        qtd: item.qtd,
      };
      pagamentosArray.push(pagamentoObj);

      console.log(
        `checkoutData - Cartão ${index + 1}: ID Produto - ${
          pagamentoObj.idProduto
        }, ID Cartão - ${pagamentoObj.idCartao}, Valor - ${
          pagamentoObj.valorCartao
        }, Valor Produto - ${pagamentoObj.valorProduto}`
      );
    });
  });

  if (checkTotal != carrinhoData.valorTotal) {
    console.log('Valor não é igual ao total: ' + checkTotal);
  } else {
    console.log('Valor é igual ao total:  ' + checkTotal);
  }

  const requestBody = {
    idCliente: checkoutData.idCliente,
    valorFinal: carrinhoData.valorTotal,
    valorDesconto: checkoutData.valorDesconto,
    valorPago: checkoutData.valorPago,
    valorFrete: checkoutData.valorFrete,
    idEndereco: checkoutData.idEndereco,
    pagamentos: pagamentosArray, // Pass the array of pagamentos objects
  };
  console.log('requestBody ' + requestBody.pagamentos[0].idProduto);
  fetch(`http://localhost:3001/checkout/finalizar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
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
      carrinhoData.valorTotal = Math.ceil(carrinhoData.valorTotal);
      checkoutData.valorPago = carrinhoData.valorTotal;

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

function addCartao() {
  checkoutData.qtdCartoes++;
  checkoutData.cartoes[checkoutData.qtdCartoes] = { id: '', valor: '' };

  console.log(checkoutData.qtdCartoes);
}

function removeCartao() {
  if (checkoutData.qtdCartoes > 0) {
    checkoutData.cartoes.splice(
      checkoutData.qtdCartoes,
      checkoutData.qtdCartoes
    );
    checkoutData.qtdCartoes--;
  }
}

function validarCupom() {
  console.log('cupom ' + checkoutData.cupom);
  console.log('idCliente ' + checkoutData.idCliente);

  const requestBody = {
    idCliente: checkoutData.idCliente,
    cupom: checkoutData.cupom,
  };
  console.log('cupom ' + requestBody.cupom);
  console.log('idCliente ' + requestBody.idCliente);

  fetch(`http://localhost:3001/validarCupom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      checkoutData.valorPago = carrinhoData.valorTotal - Number(data.valor);

      console.log('Resposta do backend:', data);
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
function calcularFrete() {
  console.log('Funciona');
  checkoutData.valorFrete = Math.floor(Math.random() * 100);
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
      <h3>Valor dos Produtos</h3>
      <h2>{{ checkoutData.valorPago }}</h2>
    </div>
    <div>
      <h3>Valor do Frete</h3>
      <h2>{{ checkoutData.valorFrete }}</h2>
    </div>
    <div>
      <h3>Total a Pagar</h3>
      <h2>{{ Math.ceil(checkoutData.valorPago + checkoutData.valorFrete) }}</h2>
    </div>
    <div>
      <h1>Selecione o Endereço</h1>
      <select
        name=""
        id="cartao"
        v-model="checkoutData.idEndereco"
        v-on:change="calcularFrete()"
      >
        <option v-for="endereco in enderecoData.enderecos" :value="endereco.id">
          {{ endereco.endereco }}
        </option>
      </select>
    </div>
    <div>
      <h1>Selecione o Método de Pagamento</h1>
      <h2>Escolha o Cartão</h2>
      <select name="" id="cartao_0" v-model="checkoutData.cartoes[0].id">
        <option v-for="cartao in cartoesData.cartoes" :value="cartao">
          {{ cartao.numeroCartao }}
        </option>
      </select>
      <h2>Valor a Pagar no Cartão</h2>
      <input
        type="number"
        v-model="checkoutData.cartoes[0].valor"
        min="0"
        :max="carrinhoData.valorTotal + checkoutData.valorFrete"
      />
      <div>
        <button v-on:click="addCartao()">Adicionar Cartão</button>
        <button v-on:click="removeCartao()">Remover Cartão</button>
      </div>
      <div v-for="(val, index) in checkoutData.qtdCartoes">
        <h2>Escolha o Cartão</h2>
        <select
          :name="'cartao_' + val"
          :id="'cartao_' + val"
          v-model="checkoutData.cartoes[val].id"
          :max="carrinhoData.valorTotal + checkoutData.valorFrete"
          :min="0"
        >
          <option v-for="cartao in cartoesData.cartoes" :value="cartao">
            {{ cartao.numeroCartao }}
          </option>
        </select>
        <h2>Valor a Pagar no Cartão</h2>
        <input
          type="number"
          v-model="checkoutData.cartoes[val].valor"
          :min="0"
          :max="carrinhoData.valorTotal - checkoutData.cartoes[0].valor"
        />
      </div>
    </div>
    <div>
      <input type="text" v-model="checkoutData.cupom" /> Insira o código do
      cupom
      <button v-on:click="validarCupom()">Validar Cupom</button>
    </div>
    <button v-on:click="addCheckOut()">Finalizar</button>
  </main>
</template>
